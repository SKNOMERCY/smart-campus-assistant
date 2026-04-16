import cors from "cors";
import express from "express";
import morgan from "morgan";

import chatRoutes from "./routes/chatRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/chat", chatRoutes);
app.use("/api/faqs", faqRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    error: "Something went wrong on the server. Please try again."
  });
});

export default app;
