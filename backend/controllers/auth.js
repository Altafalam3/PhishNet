import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

export const register = async (req, res, next) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("exist");
            return res.status(409).json({ error: "User with this email already exists." });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            ...req.body,
            password: hash,
        })
        await newUser.save()
        res.status(200).send("User has been created.")
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, "User not found"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect)
            return next(createError(400, "Wrong password"));

        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT,
            {
                expiresIn: "1h"
            }
        );

        const { password, ...userr } = user._doc;

        const option = {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 6),
            httpOnly: false
        }

        res.status(200).cookie("access_token", token, option).json(userr);
    } catch (err) {
        next(err);
    }
}


export const userVerification = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.json({ status: false });
        }

        jwt.verify(token, process.env.JWT, async (err, data) => {
            if (err) {
                return res.json({ status: false });
            }
            
            const userRes = await User.findById(data.id);
            if (userRes) {
                const { password, ...user } = userRes._doc;
                return res.json({ status: true, user });
            }
            else {
                return res.json({ status: false });
            }
        })
    }
    catch (err) {
        next(err);
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie('access_token', ' ', { expires: new Date(0) });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
