import cors from 'cors';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import errorHandler from './middlewares/globalErrorHandler';
import { notFound } from './middlewares/notFound';

dotenv.config();

const app: Application = express();
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000", 
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth)); 



app.use(express.json());



app.use(notFound)
// app.use(errorHandler)
export default app;