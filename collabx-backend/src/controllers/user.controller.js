import httpStatus from "http-status";
import {User} from "../models/user.model.js";
import bcrypt, {hash} from "bcrypt";
import crypto from "crypto";


const login = async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({message: "Please Provid"})
    }

    try{
        const user = await User.findOne({ username });
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message: "User not found"})
        }

        if(await bcrypt.compare(password, user.password)) {
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await   user.save();
            return res.status(httpStatus.OK).json({token: token})
        }
    } catch {
        return res.status(500).json({message: "Something went wrong"})
    }
}


const register = async (req, res) => {
    const {name, username, password} = req.body;


    try{
        const existinguser = await User.findOne({ username });
        if(existinguser){
            return res.status(httpStatus.FOUND).json({message: "User is already exists"});
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedpassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({message: "User Registered"});
    } catch {
        res.json({message: "Something Went Wrong"});
    }
}

export  {login, register}