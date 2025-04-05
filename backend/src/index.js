import dotenv from "dotenv";
import app from "./app.js"

dotenv.config({
    path: "./env",
});

const port = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.send("Pratibimb Backend!")
})

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
})