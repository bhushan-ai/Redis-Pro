import "dotenv/config";
import express from "express";
import Redis from "ioredis";

const app = express();
const redis = new Redis(process.env.REDIS_URL);
const PORT = process.env.PORT || 3000;

app.use(express.json());

function otpKey(phoneNo) {
  return `otp:${phoneNo}`;
}

app.get("/", (req, res) => {
  res.send("Welcome to OTP service");
});

app.post("/otp", async (req, res) => {
  const { phoneNo } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(otpKey(phoneNo), otp, "EX", 200);

  res.json({ message: "OTP sent", otp: otp });
});

app.post("/verify-otp", async (req, res) => {
  const { phoneNo, otp } = req.body;
  const savedOtp = await redis.get(otpKey(phoneNo));

  if (!savedOtp) {
    res.status(400).json({ message: "OTP expired or not found" });
  }

  if (savedOtp !== otp) {
    res.status(400).json({ message: "Invalid Otp" });
  }

  await redis.del(otpKey(phoneNo));
  res.json({ message: "OTP verified successfully" });
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const ttl = await redis.ttl(otpKey(req.params.phone));

  res.json({ ttl });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
