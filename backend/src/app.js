import cors from "cors";
import express from "express";
import morgan from "morgan";

import chatRoutes from "./routes/chatRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";

const app = express();

const DEFAULT_ALLOWED_ORIGINS = [
  "https://smart-campus-assistant-kappa.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

const configuredOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins]);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

function sendHealthResponse(_req, res) {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
}

app.get("/", (_req, res) => {
  res.json({
    service: "Northbridge FAQ backend",
    endpoints: ["/api/health", "/api/chat", "/api/faqs"]
  });
});
app.get("/health", sendHealthResponse);
app.get("/api/health", sendHealthResponse);

app.use("/api/chat", chatRoutes);
app.use("/api/faqs", faqRoutes);

app.use((error, _req, res, _next) => {
  const statusCode = error.message?.startsWith("CORS blocked") ? 403 : 500;

  if (statusCode === 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    error:
      statusCode === 403
        ? error.message
        : "Something went wrong on the server. Please try again."
  });
});

export default app;
