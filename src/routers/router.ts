import express, { Express } from 'express';
import authRoute from './auth.route';
const webRoute = express.Router();

const router = (app: Express) => {
    app.use("/auth", authRoute);
}

export default router; 