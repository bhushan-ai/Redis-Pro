import { Redis } from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL);

subscriber.subscribe("notifications", (err) => {
  if (err) {
    console.error("Failed to subscribe to notifications channel:", err);
    return;
  }
  console.log("Subscribed successfully");
});

subscriber.on("message", (channel, message) => {
  console.log("Received on", channel, ":", JSON.parse(message));
});
