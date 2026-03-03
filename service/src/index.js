
import express from "express";
import Redis from "ioredis";
import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

/**
 * Feature Flag Structure:
 * {
 *   key: "new_checkout",
 *   enabled: true,
 *   rollout: 50   // percentage rollout
 * }
 */

function isEnabledForUser(flag, userId) {
  if (!flag.enabled) return false;
  const hash = Math.abs(userId.split("").reduce((a,c)=>a+c.charCodeAt(0),0));
  return (hash % 100) < flag.rollout;
}

// Create / Update flag
app.post("/flags", async (req, res) => {
  const { key, enabled, rollout } = req.body;
  const flag = { key, enabled, rollout };
  await redis.set(`flag:${key}`, JSON.stringify(flag));
  res.json({ success: true, flag });
});

// Read flag (Edge cache via Redis)
app.get("/flags/:key/:userId", async (req, res) => {
  const { key, userId } = req.params;
  const data = await redis.get(`flag:${key}`);
  if (!data) return res.status(404).json({ error: "Flag not found" });

  const flag = JSON.parse(data);
  const active = isEnabledForUser(flag, userId);

  res.json({
    key,
    userId,
    active
  });
});

app.listen(5000, () => {
  console.log("Feature Flag Service running on port 5000");
});
