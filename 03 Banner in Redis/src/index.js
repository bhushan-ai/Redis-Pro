import "dotenv/config";
import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
import mongo from "mongoose";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);

app.get("/", (req, res) => {
  res.send("Api is working");
});

app.post("/banner", async (req, res) => {
  const banner = await redis.set(
    process.env.BANNER_KEY,
    req.body.message || "Welcome to redis pro series",
  );

  res.json({ success: true });
});

app.get("/banner", async (req, res) => {
  const message = await redis.get(process.env.BANNER_KEY);
  res.json({ message });
});

app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(process.env.BANNER_KEY);
  res.json({ exists: exists });
});

app.delete("/banner", async (req, res) => {
  await redis.del(process.env.BANNER_KEY);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("server running on port 3000");
});
