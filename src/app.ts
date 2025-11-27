import express, { Request, Response } from "express";
import router from "./routers/router";
import passport from "./config/passport.config";

const app = express();
const PORT = 3000;

passport.initialize();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router(app);

app.listen(PORT, () => {
    console.log(`App is successfully running on:  http://localhost:${PORT}`);
})

