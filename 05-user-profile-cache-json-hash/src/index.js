import "dotenv/config";
import express from "express";
import Redis from "ioredis";
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);

app.post("/user/:id/json", async (req, res) => {
  await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
  res.json({ savedAs: "json" });
});

app.get("/user/:id/json", async (req, res) => {
  const raw = await redis.get(`user:${req.params.id}:json`);
  res.json({ user: raw ? JSON.parse(raw) : null });
});

app.post("/user/:id/hash", async (req, res) => {
  await redis.hset(`user:${req.params.id}:hash`, req.body);
  res.json({ savedAs: "hash" });
});

app.get("/user/:id/hash", async (req, res) => {
  const user = await redis.hgetall(`user:${req.params.id}:hash`);
  res.json({ user });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
