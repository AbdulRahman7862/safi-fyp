import bcrypt from "bcryptjs"
import sendEmail from "../utils/send_email"

class ResetPassword {
  async generateOtp(user) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      user.otp = otp
      user.otpExpiry = Date.now() + 10 * 60 * 1000
      await user.save()
      await sendEmail(user.email, otp)
      return true
    } catch (error) {
      console.error("Error generating OTP", error)
      return false
    }
  }
  async validateOtp (email, otp){
    try {
        const user = await User.findOne({email});
        if(!user || user.otp !== otp || user.otpExpiry < Date.now()){
            return false;
        }
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return true;
    } catch (error) {
        console.error("Error validating OTP:" , error);
        return false;
    }
  }
  async hashedPassword (user, newPassword){
    try {
        // const hashedPassword = await bcrypt.compare(newPassword, 10);
        // user.password = hashedPassword;
        // await user.save();
        const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(newPassword, salt);
await user.save();

        return true;
    } catch (error) {
        console.error("Error hashing password", error);
        return false;
    }
  }
}

export default ResetPassword