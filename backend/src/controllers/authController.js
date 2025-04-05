import {User} from "../models/user.model.js"

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
    return errors;
}


export const signup = async (req,res)=>{
    const {email, password} = req.body;
    //console.log(`${email} ==> ${password}`);
    try {
        const user = await User.create({email, password});
        res.status(201).json(user);
    } catch (err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

export const login = async (req,res)=>{
    const {email, password} = req.body;
    //console.log(`${email} ==> ${password}`);
    res.send("login success")
}