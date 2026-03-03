import app from "./app";
import { prisma } from "./lib/prisma";

// Connect to DB (no process.exit in serverless)
prisma.$connect()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// 🔥 IMPORTANT: Export the app for Vercel
export default app;