import dotenv from "dotenv";
dotenv.config({
    path: "./env",
});

import jwt from "jsonwebtoken"
import app from "./app.js"
import connectDB from "./db/db.js"
import {requireAuth} from "./middlewares/authMiddleware.js";
import { addBmi, showBmi } from "./controllers/bmiController.js";
import { exTranslate, xeTranslate } from "./controllers/translateController.js";

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

app.post("/ex", exTranslate);

app.post("/xe", xeTranslate);

/*
app.post('/translate', async (req, res) => {
    console.log("Request Body:", req.body); // Add this line
    try {
      const { text, from, to } = req.body;
      const result = await translate(text, { from: from || 'auto', to });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  
*/
