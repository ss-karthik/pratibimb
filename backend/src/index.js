import dotenv from "dotenv";
import app from "./app.js"
import connectDB from "./db/db.js"

dotenv.config({
    path: "./env",
});

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

