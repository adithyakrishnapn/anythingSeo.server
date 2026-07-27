import bcrypt from "bcrypt";

const hashOTP = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    return hashedOTP;
}

export { hashOTP };