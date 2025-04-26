import User from "../../model/user_model.js"

const sendResetOtp = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({
      email,
    })
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }
    const otpSent = await generateOtp(user)
    if (otpSent) {
      res.status(200).json({
        message: "OTP sent to your email",
      })
    } else {
      res.status(500).json({
        message: "Failed to send OTP",
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    })
  }
}

const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body

  try {
    const isValid = await validateOtp(email, otp)
    if (isValid) {
      res.status(200).json({
        message: "OTP verified",
      })
    } else {
      res.status(400).json({
        message: "Invalid or expired OTP",
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    })
  }
}

const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body
  if (newPassword != confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    } else {
      res.status(500).json({
        message: "Failed to reset password",
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    })
  }
}

export { resetPassword, sendResetOtp, verifyResetOtp }

