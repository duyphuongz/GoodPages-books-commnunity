import express, { Request, Response } from "express";
import router from "./routers/router";
import passport from "./configs/passport.config";
import "dotenv/config"

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// seed();

app.use(passport.initialize());

router(app);

app.listen(PORT, () => {
    console.log(`App is successfully running on:  http://localhost:${PORT}`);
})

