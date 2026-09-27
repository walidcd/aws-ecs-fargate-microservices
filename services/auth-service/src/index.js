const AWSXRay = require("aws-xray-sdk");
const express = require("express");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const { createClient } = require("redis");
const { randomUUID } = require("crypto");

const app = express();
AWSXRay.setContextMissingStrategy("LOG_ERROR");
app.use(AWSXRay.express.openSegment("AuthService"));
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = createClient({ url: process.env.REDIS_URL });
redis.on("error", err => console.error(JSON.stringify({service:"auth",level:"error",message:err.message})));

app.get("/health", (_req,res) => res.json({status:"ok",service:"auth"}));

app.post("/api/auth/register", async (req,res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password || password.length < 8) {
      return res.status(400).json({message:"email and password (min 8 chars) are required"});
    }
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users(email,password_hash) VALUES($1,$2) RETURNING id,email,created_at",
      [email.toLowerCase(), hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({message:"user already exists"});
    console.error(JSON.stringify({service:"auth",level:"error",message:e.message}));
    res.status(500).json({message:"internal error"});
  }
});

app.post("/api/auth/login", async (req,res) => {
  try {
    const { email, password } = req.body || {};
    const result = await pool.query("SELECT id,email,password_hash FROM users WHERE email=$1",[String(email||"").toLowerCase()]);
    if (!result.rowCount || !(await bcrypt.compare(String(password||""), result.rows[0].password_hash))) {
      return res.status(401).json({message:"invalid credentials"});
    }
    const token = randomUUID();
    await redis.set("session:" + token, JSON.stringify({userId:result.rows[0].id,email:result.rows[0].email}), {EX:3600});
    res.json({token,expiresIn:3600});
  } catch (e) {
    console.error(JSON.stringify({service:"auth",level:"error",message:e.message}));
    res.status(500).json({message:"internal error"});
  }
});

async function start() {
  await redis.connect();
  app.use(AWSXRay.express.closeSegment());

const port = Number(process.env.PORT || 8081);
  app.listen(port, () => console.log(JSON.stringify({service:"auth",event:"started",port})));
}
start().catch(e => { console.error(e); process.exit(1); });
