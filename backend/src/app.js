import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/authRoutes.js"


const app = express();
const allowedOrigins = [process.env.CORS_ORIGIN, 'http://localhost:5173'];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(router)

export default app;