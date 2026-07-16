import User from "../models/user.model.js";

export const signupService = async (userData) => {
    return await User.create(userData);
};

export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const loginService = async(email,password)=>{
    return await User.$where({ email: email, password: password });
}

export const getUserById = async (id) => {
    return await User.findById(id).select("-password");
};