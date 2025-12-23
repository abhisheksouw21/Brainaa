import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { ContentModel, LinkModel, UserModel } from "../src/db";
import { JWT_PASSWORD, frontendUrl } from "../src/config";
import { userMiddleware } from "../src/middleware";
import cors from "cors";
import { Signin, Signup } from "../src/routes/auth";
import { DeleteContent, GetContent, PostContent, PutContent } from "../src/routes/content";
import { GetShareBrain, PostShareBrain } from "../src/routes/brain";

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: [frontendUrl, "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.json({
        message: `Brainly backend is running`
    });
});

app.post("/api/v1/signup", Signup);
app.post("/api/v1/signin", Signin);
app.post("/api/v1/content", userMiddleware, PostContent);
app.get("/api/v1/content", userMiddleware, GetContent);
app.put("/api/v1/content", userMiddleware, PutContent);
app.delete("/api/v1/content", userMiddleware, DeleteContent)
app.post("/api/v1/brain/share", userMiddleware, PostShareBrain);
app.get("/api/v1/brain/:shareLink", GetShareBrain);

export default app;
