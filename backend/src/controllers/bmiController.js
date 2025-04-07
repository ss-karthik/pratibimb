import { User } from "../models/user.model.js"; 
import { Bmi } from "../models/bmi.model.js"; 

export const addBmi = async (req, res) => {
  const { deviceId, height, weight } = req.body;
  try {
    const user = await User.findOne({ deviceId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bmi = new Bmi({
      height,
      weight,
      user: user._id,
    });

    const savedBmi = await bmi.save();

    user.bmiValues.push(savedBmi._id);
    await user.save();

    res.status(201).json({ message: "BMI added successfully", bmi: savedBmi });
  } catch (err) {
    console.error("BMI error:", err);
    res.status(400).json({ error: "BMI error", details: err.message }); // Provide more specific error details
  }
};

export const showBmi = async (req,res)=>{
  const user = req.user;
  try {
    const bmiData = await Bmi.find({ user: user._id }).sort({ createdAt: -1 });
    res.status(201).json(bmiData);
  } catch(err) {
    res.status(400).json({ error: "BMI error"});
  }
}