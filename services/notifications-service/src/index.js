const AWSXRay = require("aws-xray-sdk");
const express = require("express");
const app = express();
AWSXRay.setContextMissingStrategy("LOG_ERROR");
app.use(AWSXRay.express.openSegment("NotificationsService"));
app.use(express.json());

app.get("/health", (_req,res) => res.json({status:"ok",service:"notifications"}));

app.post("/internal/notifications", (req,res) => {
  const correlationId = req.get("x-correlation-id") || "none";
  console.log(JSON.stringify({
    service:"notifications",
    event:"notification_received",
    correlationId,
    payload:req.body
  }));
  res.status(202).json({accepted:true,correlationId});
});

app.use(AWSXRay.express.closeSegment());

const port = Number(process.env.PORT || 8083);
app.listen(port, () => console.log(JSON.stringify({service:"notifications",event:"started",port})));
