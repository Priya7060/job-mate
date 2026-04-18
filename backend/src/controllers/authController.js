import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//REGISTER USER
export const registerUser=async (req,res)=>{
    try{
        const{name,email,password,role}=req.body;

        // 1.validation
        if(!name|| !email || !password ){
            return res.status(400).json({message:"All fields are required"});
        }

        //2.check if user already exists
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        //3. hash password
        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt);

        //4.create user
        const user=await User.create({
            name,
            email,
            password:hashedpassword,
            role
        });

        //5.response
        res.status(201).json({
            message:"user resgistered successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    }

    catch(error){
        res.status(500).json({message:"server error"});
    }
};

//LOGIN USER
export const loginUser=async(req,res)=>{
    try{
        const{email,password}=req.body;

        //1.validate input
        if(!email || !password){
            return res.status(400).json({message:"all fields are required"});
        }

        //2.check user exists
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"invalid credentials"});
        }

        //3.compare password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"});
        }

        //4.generate JWT
        const token=jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"14d"}
        );

        //5.send response
        res.status(200).json({
            message:"login successfully",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    }
    catch(error){
        res.status(500).json({message:"server error"});
    }
};
