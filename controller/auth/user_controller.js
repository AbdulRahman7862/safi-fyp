import UserService from "../../services/user_service.js"

const createUser = async (req, res) => {
  try {
    console.log("Registering user:", req.body)
    const { username, email, password, userType } = req.body
    if (!username || !email || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: "All fields (username, email, password) are required.",
      })
    }
    const newUser = await UserService.createUser(req.body)

    res.status(201).json({
      success: true,
      message: "User Registered Successfully.",
      data: newUser,
    })
  } catch (error) {
    console.error("Error registering user:", error.message)
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    const { user, token } = await UserService.loginUser(email, password)

    res.status(200).json({
      success: true,
      message: "User Logged In Successfully",
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    console.error("Login error:", error.message)
    res.status(400).json({
      success: false,
      message: error.message || "Error Logging In",
    })
  }
}
const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers()

    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: users,
    })
  } catch (error) {
    console.error("Error fetching users:", error.message)
    res.status(400).json({
      success: false,
      message: error.message || "Unable to fetch users.",
    })
  }
}
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body
    console.log("Email received:", email)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      })
    }

    const response = await UserService.generateOtp(email)

    res.status(200).json({
      success: true,
      message: response.message,
    })
  } catch (error) {
    console.error("Error sending OTP:", error.message)
    res.status(400).json({
      success: false,
      message: error.message || "Unable to send OTP.",
    })
  }
}

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required." })
    }
    const response = await UserService.verifyOtp(email, otp)

    res.status(200).json({ success: true, message: response.message })
  } catch (error) {
    console.error("Error verifying OTP:", error.message)
    res.status(400).json({ success: false, message: error.message })
  }
}

const changePassword = async (req, res) => {
  try {
    console.log("Request User:", req.user);  

    if (!req.user || !req.user.id) {
      throw new Error("User ID is missing. Please log in again.");
    }

    const userId = req.user.id;  
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const result = await UserService.changePassword(
      userId,
      oldPassword,
      newPassword,
      confirmPassword
    );

    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    console.error("Error:", error.message); 
    res.status(400).json({ success: false, message: error.message });
  }
};


const logOut = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]
    const response = await UserService.logOut(token)

    res.clearCookie("token")

    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const userProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { username, email, gender, phoneNumber } = req.body;
    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserService.updateUser(userId, {
      username,
      email,
      gender,
      phoneNumber,
    });

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export {
  changePassword,
  createUser,
  getAllUsers, loginUser, logOut, sendOtp, updateUserProfile, userProfile,
  verifyOtp
}

