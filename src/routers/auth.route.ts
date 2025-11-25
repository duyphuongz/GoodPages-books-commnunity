import express from 'express';

const authRoute = express.Router();

authRoute.get("/sign-in", (req, res) => {
    res.status(200).json({
        statusCode: 200,
        success: true,
        data: null,
        error: null
    });
});

export default authRoute;