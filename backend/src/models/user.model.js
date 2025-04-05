import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"

const isEmail = validator.isEmail

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            requried: [true, 'Please enter an Email'],
            unique:true,
            lowercase: true,
            validate: [isEmail, 'Please enter a Valid Email']
        },
        password: {
            type: String,
            requried: [true, 'Please enter a Password'],
            minLength: [6, 'Minimum length of password is 6 characters'],
        },

    }, 
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

export const User = mongoose.model("User", userSchema)