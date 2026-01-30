import cors from 'cors';
import express, { Application } from 'express';
import dotenv from 'dotenv';
const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000", // client side url
    credentials: true
}))

app.use(express.json());
export default app;