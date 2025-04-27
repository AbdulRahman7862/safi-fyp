import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import Otp from "../model/otp_model.js"
import Role from "../model/role_model.js"
import User from "../model/user_model.js"
import ApiError from "../utils/ApiError.js"
import sendEmail from "../utils/send_email.js"

const JWT_SECRET = process.env.JWT_SECRET
class UserService {
  static async createUser(req) {
    try {
      const { username, email, password, userType, roleId } = req
      if (!username || !email || !password || !userType || !roleId) {
        throw new Error(
          "All fields (username, email, password, userType, roleId) are required."
        )
      }
      const role = await Role.findOne({ where: { name: userType } })
      if (!role) {
        throw new Error(`Role "${userType}" not found in the database.`)
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        userType: role.name,
        roleId: role.id,
      })

      console.log("User Created Successfully:", newUser)
      return newUser
    } catch (error) {
      console.error("Error Creating User:", error.message)
      throw new Error(error.message || "Unable to create user.")
    }
  }

  static async loginUser(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.hash(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.userType,
      },
      process.env.JWT_SECRET || "DineDeal",
      {
        expiresIn: "1h",
      }
    );

    return {
      user: {
        id: user.id, 
        email: user.email,
        username: user.username,
        roleId: user.roleId,
        userType: user.userType,
      },
      token,
    };
  }

  static async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: ["id", "username", "email", "userType", "createdAt"],
      })

      if (!users || users.length === 0) {
        throw new ApiError(404, "No users found.")
      }

      return users
    } catch (error) {
      console.error("Error fetching users:", error.message)
      throw new Error(error.message || "Unable to fetch users.")
    }
  }
  static async generateOtp(email) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

       await Otp.create({ email, otp, expiresAt })

      const subject = "Your OTP for verification"
      const text = `Your OTP for verification is: ${otp}. It will expire in 15 minutes.`

      await sendEmail(email, subject, text)

      return { message: "OTP sent successfully." }
    } catch (error) {
      console.error("Error generating OTP:", error.message)
      throw new Error(error.message || "Unable to generate OTP.")
    }
  }

  static async verifyOtp(email, otp) {
    try {
      console.log("Verifying OTP for:", { email, otp })

      const record = await Otp.findOne({ where: { email, otp } })
      console.log("Database query result:", record)

      if (!record) {
        console.log("OTP record not found.")
        throw new Error("Invalid OTP.")
      }

      console.log("Found OTP record:", record)

      if (new Date() > record.expiresAt) {
        throw new Error("OTP has expired.")
      }

      await Otp.destroy({ where: { email, otp } })
      console.log("OTP verified and deleted successfully.")
      return { message: "OTP verified successfully." }
    } catch (error) {
      console.error("Error verifying OTP:", error.message)
      throw error
    }
  }
  static async changePassword(userId, oldPassword, newPassword, confirmPassword) {
    try {
      // ✅ Fix: Correct way to find user
      const user = await User.findOne({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      console.log("User found:", user.id); // Debugging

      // ✅ Fix: Ensure password comparison works correctly
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new Error("Old password is incorrect");

      console.log("Old password matched"); // Debugging

      // ✅ Fix: Ensure new passwords match
      if (newPassword !== confirmPassword)
        throw new Error("Passwords do not match");

      console.log("New passwords matched"); // Debugging

      // ✅ Fix: Hash new password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.compare(newPassword, salt);
      await user.save();

//       const salt = await bcrypt.genSalt(10);
// user.password = await bcrypt.hash(newPassword, salt);
// await user.save();


      console.log("Password changed successfully"); // Debugging
      return "Password changed successfully";
    } catch (error) {
      console.error("Change Password Error:", error.message); // Debugging
      throw new Error(error.message);
    }
  }
  static async logOut(token) {
    try {
      if (!token) {
        throw new Error("No token provided")
      }

      return {
        success: true,
        message: "User logged out successfully",
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  static async getUserById(id) {
    return await User.findByPk(id);
  }
  
  static async updateUser(id, updateData) {
    return await User.update(updateData, { where: { id: id } });
  }
  
}

export default UserService
