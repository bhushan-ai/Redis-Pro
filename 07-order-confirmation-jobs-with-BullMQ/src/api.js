import "dotenv/config";
import express from "express";
import Redis from "ioredis";
const PORT = process.env.PORT || 4000;
import { emailQueue } from "./queue.js";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);

app.post("/welcome-email", async (req, res) => {
  const job = await emailQueue.add(
    "Send Welcome Email",
    {
      to: req.body.to,
      name: req.body.name || "Learner",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );
  res
    .status(200)
    .json({
      message: "Welcome email job has been added to the queue!",
      jobId: job.id,
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
