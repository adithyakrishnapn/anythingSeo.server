import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, no token provided"
            });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized, invalid token",
            error: error.message
        });
    }
}