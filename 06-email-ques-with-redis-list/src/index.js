import "dotenv/config";
import express from "express";
import Redis from "ioredis";
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);
const QUEUE_KEY = process.env.QUEUE_KEY;

app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject,
    body: req.body.body,
    createdAt: new Date().toISOString(),
  };

  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  res.status(201).json({ queued: true, job });
});

app.get("/emails/process-one", async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);
  if (!rawJob) {
    return res.status(200).json({ message: "No jobs in the queue" });
  }

  const job = JSON.parse(rawJob);
  //simulate email sending
  res.status(200).json({ message: "Email sent", job });
});

app.get("/emails/queue-length", async (req, res) => {
  const length = await redis.llen(QUEUE_KEY); 
  res.status(200).json({ queueLength: length });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
