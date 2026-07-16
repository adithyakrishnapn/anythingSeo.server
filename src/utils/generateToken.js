import jwt from "jsonwebtoken";
import env from "../config/env.js";

export  const generateToken = (userId,email,role) =>{
    const token = jwt.sign(
        {
            userId,email,role
        },env.JWT_SECRET,
        {
            expiresIn:env.JWT_EXPIRES_IN
        });
    return token;

};