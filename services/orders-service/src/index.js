const express = require("express");
const { Pool } = require("pg");
const { createClient } = require("redis");

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = createClient({ url: process.env.REDIS_URL });
const notificationsUrl = process.env.NOTIFICATIONS_URL || "http://notifications.microservices.local:8083";

async function requireSession(req,res,next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = token ? await redis.get("session:" + token) : null;
  if (!session) return res.status(401).json({message:"unauthorized"});
  req.session = JSON.parse(session);
  next();
}

app.get("/health", (_req,res) => res.json({status:"ok",service:"orders"}));

app.get("/api/orders", requireSession, async (req,res) => {
  const result = await pool.query(
    "SELECT id,item,quantity,created_at FROM orders WHERE user_id=$1 ORDER BY created_at DESC",
    [req.session.userId]
  );
  res.json(result.rows);
});

app.post("/api/orders", requireSession, async (req,res) => {
  try {
    const { item, quantity } = req.body || {};
    if (!item || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({message:"item and positive integer quantity are required"});
    }
    const result = await pool.query(
      "INSERT INTO orders(user_id,item,quantity) VALUES($1,$2,$3) RETURNING id,item,quantity,created_at",
      [req.session.userId,item,quantity]
    );
    const order = result.rows[0];
    fetch(notificationsUrl + "/internal/notifications", {
      method:"POST",
      headers:{"content-type":"application/json","x-correlation-id":req.get("x-correlation-id") || String(order.id)},
      body:JSON.stringify({type:"ORDER_CREATED",email:req.session.email,order})
    }).catch(err => console.error(JSON.stringify({service:"orders",event:"notification_failed",message:err.message})));
    res.status(201).json(order);
  } catch (e) {
    console.error(JSON.stringify({service:"orders",level:"error",message:e.message}));
    res.status(500).json({message:"internal error"});
  }
});

async function start() {
  await redis.connect();
  const port = Number(process.env.PORT || 8082);
  app.listen(port, () => console.log(JSON.stringify({service:"orders",event:"started",port,notificationsUrl})));
}
start().catch(e => { console.error(e); process.exit(1); });
