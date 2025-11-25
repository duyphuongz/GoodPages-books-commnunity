import express, { Request, Response } from "express";
import router from "./routers/router";

const app = express();
const PORT = 3000;

router(app);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        success: true,
        message: "HELLO SHENHE",
        data: {
            message: "This is homepage"
        },
        error: null
    })
});

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
})

