import mongoose, {Schema} from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const isEmail = validator.isEmail;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      requried: [true, "Please enter an Email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a Valid Email"],
    },
    password: {
      type: String,
      requried: [true, "Please enter a Password"],
      minLength: [6, "Minimum length of password is 6 characters"],
    },
    deviceId: {
      type: String,
      required: [true, "Please enter a Device ID"],
      unique: true,
    },
    age: {
      type: Number,
      required: [true, "Please enter age"],
    },
    gender: {
      type: String,
      required: [true, "Please select gender"],
    },
    smoker: {
      type: Boolean,
      required: true,
      default: false,
    },
    alcoholic: {
      type: Boolean,
      required: true,
      default: false,
    },
    bmiValues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bmi",
      }
    ]
  },
  {
    timestamps: true,
  },
);



userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    if (password === user.password) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Email");
};

export const User = mongoose.model("User", userSchema);
