import cors from 'cors';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import errorHandler from './middlewares/globalErrorHandler';
import { notFound } from './middlewares/notFound';
import categoryrouters from './categories/categories.routes';
import emailrouter from './lib/supportemail';
import router from './tutors/tutors.routes';
import availabilityrouter from './availability/availability.routes';
import bookingrouter from './bookings/bookings.routes';
import reviewrouter from './reviews/reviews.routes';
import userrouter from './users/users.routes';

dotenv.config();

const app: Application = express();

// 1. Configure allowed origins for local and production
const allowedOrigins = [
  process.env.APP_URL, // Your main Frontend URL
  "http://localhost:3000",
  "http://localhost:5000",
].filter(Boolean) as string[];

// 2. Enhanced CORS for Vercel Deployment
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman or mobile)
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin); // Regex to allow all Vercel previews

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
}));

app.use(express.json());

// Better Auth Handler
app.all("/api/auth/*splat", toNodeHandler(auth)); 

// Health Check
app.get("/", (req, res) => {
  res.send("SkillBridge API is running...");
});

// Routes
app.use("/api/categories", categoryrouters);
app.use("/api/tutor", router);
app.use("/api/support", emailrouter);
app.use("/api/availability", availabilityrouter);
app.use("/api/bookings", bookingrouter);
app.use("/api/reviews", reviewrouter);
app.use("/api/users", userrouter); 

// Error Handling
app.use(notFound);
app.use(errorHandler); // Uncommented to ensure production doesn't crash silently

export default app;