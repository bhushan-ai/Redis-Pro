import "dotenv/config";
import express from "express";
import Redis from "ioredis";
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);

app.post("/post/:id/view", async (req, res) => {
  const { id } = req.params;
  //increment the view count for the post with the given id
  const views = await redis.incr(`post:${id}:views`);
  res.json({ views });
});

app.post("/leaderboard/score", async (req, res) => {
  const { userId, score } = req.body;
  const incrementedScore = await redis.zincrby("leaderboard", score, userId);
  res.json({ userId, score: incrementedScore });
});

app.get("/leaderboard", async (req, res) => {
  const getTop10 = await redis.zrevrange("leaderboard", 0, 9, "WITHSCORES");
  res.json(getTop10);
});

app.get("/leaderboard/:userId/rank", async (req, res) => {
  const rank = await redis.zrevrank("leaderboard", req.params.userId);
  if (rank === null) {
    return res.status(404).json({ message: "User not found in leaderboard" });
  }
  res.json({ userId: req.params.userId, rank: rank + 1 });
});

//assignment completed
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
