import cors from 'cors';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import errorHandler from './middlewares/globalErrorHandler';
import { notFound } from './middlewares/notFound';
import chatRoutes from './routes/chat.route';

// Import your route handlers
import categoryrouters from './categories/categories.routes';
import emailrouter from './lib/supportemail';
import router from './tutors/tutors.routes';
import availabilityrouter from './availability/availability.routes';
import bookingrouter from './bookings/bookings.routes';
import reviewrouter from './reviews/reviews.routes';
import userrouter from './users/users.routes';
import webhookRoutes from './routes/webhook.routes';

dotenv.config();

const app: Application = express();

/* 🔥 FIX 1: REQUIRED FOR VERCEL + OAUTH COOKIES */
app.set("trust proxy", 1);

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  process.env.APP_URL, 
  "http://localhost:3000",
  "http://localhost:5000",
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin); 

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

// --- BETTER AUTH HANDLER ---
app.all("/api/auth/*splat", toNodeHandler(auth));

// --- BODY PARSERS ---
app.use('/api/webhooks', webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
app.get("/", (req, res) => {
  res.send("SkillBridge API is running...");
});
app.use("/api", chatRoutes);

app.use("/api/categories", categoryrouters);
app.use("/api/tutor", router);
app.use("/api/support", emailrouter);
app.use("/api/availability", availabilityrouter);
app.use("/api/bookings", bookingrouter);
app.use("/api/reviews", reviewrouter);
app.use("/api/users", userrouter); 

// --- ERROR HANDLING ---
app.use(notFound);
app.use(errorHandler); 

export default app;