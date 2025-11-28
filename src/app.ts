import express, { Request, Response } from "express";
import router from "./routers/router";
import passport from "./configs/passport.config";
import { seed } from "./configs/seed";

const app = express();
const PORT = 3000;

passport.initialize();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

seed();

router(app);

app.listen(PORT, () => {
    console.log(`App is successfully running on:  http://localhost:${PORT}`);
})

