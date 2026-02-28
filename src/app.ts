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
import   reviewrouter from './reviews/reviews.routes';
import userrouter from './users/users.routes';

dotenv.config();


const app: Application = express();
app.use(express.json());

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000", 
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth)); 
app.use("/api/categories", categoryrouters);
app.use("/api/tutor", router);
app.use("/api/support",emailrouter);
app.use("/api/availability", availabilityrouter);
app.use("/api/bookings", bookingrouter);
app.use("/api/reviews", reviewrouter);
app.use("/api/users", userrouter); // Import user routes





app.use(notFound)
// app.use(errorHandler)
export default app;