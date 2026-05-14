import fs from "node:fs";
import path from "node:path";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import folderRoutes from "./routes/folders.js";
import fileRoutes from "./routes/files.js";
import searchRoutes from "./routes/search.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const uploadsDir = path.resolve("uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/search", searchRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`NoteVault API listening on ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  });
