import express from "express"
import {
  changePassword,
  createUser,
  getAllUsers,
  logOut,
  loginUser,
  sendOtp,
  updateUserProfile,
  userProfile,
  verifyOtp
} from "../controller/auth/user_controller.js"
import authenticate from "../middleware/authenticate.js"
import authenticateUser from "../middleware/authenticateUser.js"

const router = express.Router()
router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/users", getAllUsers)
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/change-password", authenticate, changePassword);
router.post("/logout", authenticateUser, logOut);
router.get("/:id", userProfile)
router.put("/:id", updateUserProfile)

export default router
