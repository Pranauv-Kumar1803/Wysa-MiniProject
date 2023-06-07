import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const login = async(req,res,next)=>{
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email: email}).exec();

        if(!user) {
            return next(createError(404,'user not found'));
        }
        
        const check = await bcrypt.compare(password, user.password);
        
        if(!check) {
            return next(createError(400,'Wrong Password Entered'));
        }

        const token = await jwt.sign(
            {
                id: user._id
            },
            process.env.ACCESS_TOKEN_SECRET
        );

        const {password: _, ...others} = user._doc;

        res.cookie('access_token',token,{
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 6 * 60 * 60 * 1000
        }).status(200).json(others);

    } catch (err) {
        next(err);
    }
}

export const signup = async(req,res,next)=>{
    try {
        const user = await User.findOne({email: req.body.email}).exec();

        if(user) {
            return next(createError(400,'User Already Exists!'));
        }

        const newPassword = await bcrypt.hash(req.body.password,10);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
            profile: req.body.image
        })

        await newUser.save();
        res.status(200).json(newUser);

    } catch (err) {
        next(err);
    }
}

export const getUser = async(req,res,next)=>{
    try {
        const user = await User.findById(req.user).exec();

        if(!user)
        {
            return res.status(404).json({message: "no user found!"});
        }

        return res.status(200).json({data: user});
        
    } catch (err) {
        next(err);
    }
}