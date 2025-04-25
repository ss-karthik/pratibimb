import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"


const handleErrors = (err)=>{
    console.log(err.message, err.code);
    let errors = {email: '', password: ''};

    //duplicate errors
    if(err.code === 11000){
        errors.email = 'that email is already registered'
        return errors
    }
    //validation errors
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message; 
        });
    }
    //login errors
    if(err.message === 'Incorrect Email'){
        errors.email = 'that email is not registered'
    }
    if(err.message === 'Incorrect Password'){
        errors.password = 'Incorrect Password!';
    }

    
    return errors;
}

const maxAge = 3 * 24 * 60 * 60; //3days
const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}


export const signup = async (req,res)=>{
    const {email, password, deviceId, age, gender, smoker, alcoholic} = req.body;
    //console.log(`${email} ==> ${password}`);
    try {
        const user = await User.create({email, password, deviceId, age, gender, smoker, alcoholic});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000, secure:true,
            sameSite: 'none', partitioned: true,
          });
        res.status(201).json({user: user._id});
    } catch (err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

export const login = async (req,res)=>{
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000, secure:true, 
            sameSite: 'none', partitioned: true,});
        res.status(200).json({user: user._id});
    } catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }   
}

export const logout = (req,res)=>{
    res.cookie('jwt', '', { 
      httpOnly: true, 
      maxAge: 1, 
      secure: true,
      sameSite: 'none', 
      partitioned: true
    });
    res.status(200).json({ user: null });
  }