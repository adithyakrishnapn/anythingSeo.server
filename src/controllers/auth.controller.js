import * as userService from "../services/auth.service.js";
import { comparePassword } from "../utils/comparePassword.js";
import { hashPassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";

export const signupController = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const emailCheck = await userService.findUserByEmail(email);

        if (emailCheck) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const passwordHash = await hashPassword(password);

        const userData = {
            name,
            email,
            phone,
            password: passwordHash
        };

        const user = await userService.signupService(userData);

        // Generate JWT
        const token = generateToken(
            user._id,
            user.email,
            user.role
        );

        // Store JWT in HttpOnly Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Error creating user:", error);

        return res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message
        });

    }
};

export const loginController = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await comparePassword(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = generateToken(
            user._id,
            user.email,
            user.role
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Error logging in:", error);

        return res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message
        });

    }

};


export const meController = async (req, res) => {
    try {

        const userData = await userService.getUserById(req.user.userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: userData
        });

    } catch (error) {

        console.error("Error fetching current user:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error.message
        });

    }
};


export const logoutController = (req, res) => {

    res.clearCookie("token");

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });

};