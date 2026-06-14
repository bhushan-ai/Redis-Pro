import "dotenv/config";
import express from "express";
import Redis from "ioredis";
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);


app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
