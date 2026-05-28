import "dotenv/config";
import express from "express";
import Redis from "ioredis";

const app = express();
const redis = new Redis(process.env.REDIS_URL);

function otpKey(phoneNo) {
  return `otp:${phoneNo}`;
}
