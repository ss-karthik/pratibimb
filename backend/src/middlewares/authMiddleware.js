import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

export const requireAuth = (req, res, next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken)=>{
            if(err){
                res.status(400).json({autherr: "error"});
            } else {
                let user = await User.findById(decodedToken.id);
                req.user = user;
                next();
            }
        })
    } else {
        res.status(400).json({autherr: "not logged in"});
    }
}

/*
export const checkUser =  (req,res, next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken)=>{
            if(err){
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.status(400).json({autherr: "not logged in"});
    }
}
*/