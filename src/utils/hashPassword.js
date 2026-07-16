import bcrypt from "bcrypt";


export const hashPassword = async (password) => {
    const saltValue = 10;
    const hashedPassword = await bcrypt.hash(password,saltValue);
    return hashedPassword;
}