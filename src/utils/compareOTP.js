import bcrypt from 'bcrypt';

export const compareOTP = async (otp, hashedOtp) => {
    return await bcrypt.compare(otp, hashedOtp);
}