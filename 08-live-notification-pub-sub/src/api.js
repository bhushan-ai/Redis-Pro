import "dotenv/config";
import express from "express";
import Redis from "ioredis";
const PORT = process.env.PORT || 4000;
import { emailQueue } from "./queue.js";

const app = express();
app.use(express.json());

const publisher = new Redis(process.env.REDIS_URL);

app.post("/notifications", async (req, res) => {
  const payload = {
    title: req.body.title || "Default Title",
    createdAt: new Date().toISOString(),
  };

  const receivers = await publisher.publish(
    "notifications",
    JSON.stringify(payload),
  );

  res.json({
    message: `Notification sent to ${receivers} subscribers`,
    payload,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
