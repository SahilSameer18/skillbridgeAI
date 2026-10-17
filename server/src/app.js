import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import userRouter from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import ApiError from "./utils/ApiError.js";

const app = express();
app.set("trust proxy", 1); // Respect X-Forwarded-For headers from reverse proxies (Render, Vercel, Nginx)

const allowedOrigins = [
  "http://localhost:5173",
  "https://skillbridgeai-s.vercel.app",
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(express.json());
app.use(cookieParser());

// Strict CORS: Reject unknown origins with 403 rather than omitting headers
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new ApiError(403, `CORS policy: Origin '${origin}' is not allowed`));
    },
    credentials: true,
  }),
);

// CSRF Origin Guard: Block cross-origin multipart form submissions from malicious sites
app.use((req, res, next) => {
  const isStateChanging = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  if (!isStateChanging) return next();

  const requestOrigin = req.headers.origin;
  if (requestOrigin && !allowedOrigins.includes(requestOrigin)) {
    return next(new ApiError(403, `State-changing requests from origin '${requestOrigin}' are forbidden`));
  }

  next();
});

// Health check root endpoint for Render & Uptime Monitors
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillBridge AI API Server is live",
  });
});

// Mount API routers
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/user", userRouter);

// Fallback for 404 - Route Not Found
app.use((req, res, next) => {
  next(new ApiError(404, `Endpoint not found: ${req.method} ${req.originalUrl}`));
});

// Centralized error handling middleware
app.use(errorMiddleware);

export default app;

