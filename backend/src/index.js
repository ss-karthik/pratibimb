import dotenv from "dotenv";
dotenv.config({
    path: "./env",
});

import jwt from "jsonwebtoken"
import app from "./app.js"
import connectDB from "./db/db.js"
import {requireAuth} from "./middlewares/authMiddleware.js";
import { addBmi, showBmi } from "./controllers/bmiController.js";

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("ERR: ", error);
            throw error;
        });
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGODB Connection failed!! ", err);
    });


app.get("/", (req,res)=>{
    res.send("Pratibimb Backend!")
})

app.get("/user", requireAuth, (req,res)=>{
    res.json(req.user);
})

app.get("/bmi", requireAuth, showBmi);

app.post("/bmi", addBmi);