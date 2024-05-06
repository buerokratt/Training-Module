import setRateLimit from "express-rate-limit";

export const rateLimitMiddleware = setRateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many requests",
  headers: true,
  statusCode: 429,
});
