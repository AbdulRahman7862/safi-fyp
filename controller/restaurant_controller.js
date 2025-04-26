import RestaurantService from "../services/restaurant_service.js";
const restaurantService = new RestaurantService()
const createRestaurant = async (req, res) => {
  try {
    // const { image } = req.file
    const restaurant = await restaurantService.createRestaurant(
      req.body,
      req.file,
    )
    console.log("req", req.file);
    res.status(200).json({
      success: true,
      message: "Restaurant Created Successfully",
      data: restaurant,
    })
  } catch (error) {
    console.error("Error:", error.message)
    res.status(400).json({
      success: false,
      message: error.message || "Error Creating restaurant",
    })
  }
}

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants()
    res.status(200).json({
      success: true,
      message: "Restaurants fetched successfully.",
      data: restaurants,
    })
  } catch (error) {
    console.error("Error in getAllRestaurants:", error.message)
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch restaurants.",
    })
  }
}

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantService.getAllRestaurantNames()
    res.status(200).json(restaurants)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getRestaurantName = async (req, res) => {
  const restaurantId = req.params.id

  try {
    const restaurantName =
      await restaurantService.getRestaurantById(restaurantId)

    if (restaurantName) {
      res.status(200).json({ restaurant_name: restaurantName })
    } else {
      res.status(404).json({ error: "Restaurant not found" })
    }
  } catch (error) {
    console.error("Error in getRestaurantName:", error.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

const getRestaurantNameByUserId = async (req, res) => {
  const { userId } = req.params

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    })
  }

  try {
    const restaurantName =
      await restaurantService.getRestaurantNameByUserId(userId)
    return res.status(200).json({
      success: true,
      restaurantName,
    })
  } catch (error) {
    console.error("Error in getting restaurant name:", error.message)
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    })
  }
}

export {
  createRestaurant,
  getAllRestaurants,
  getRestaurantName,
  getRestaurantNameByUserId,
  getRestaurants
};

// import RestaurantService from "../services/restaurant_service.js";
// const restaurantService = new RestaurantService();

// const createRestaurant = async (req, res) => {
//   try {
//     const restaurant = await restaurantService.createRestaurant(req.body, req.file);
//     res.status(200).json({
//       success: true,
//       message: "Restaurant Created Successfully",
//       data: restaurant,
//     });
//   } catch (error) {
//     console.error("Error in createRestaurant:", error.message);
//     res.status(error.statusCode || 400).json({
//       success: false,
//       message: error.message || "Error creating restaurant",
//     });
//   }
// };

// const getAllRestaurants = async (req, res) => {
//   try {
//     const restaurants = await restaurantService.getAllRestaurants();
//     res.status(200).json({
//       success: true,
//       message: "Restaurants fetched successfully.",
//       data: restaurants,
//     });
//   } catch (error) {
//     console.error("Error in getAllRestaurants:", error.message);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Failed to fetch restaurants.",
//     });
//   }
// };

// const getRestaurants = async (req, res) => {
//   try {
//     const restaurants = await restaurantService.getAllRestaurantNames();
//     res.status(200).json({
//       success: true,
//       data: restaurants,
//     });
//   } catch (error) {
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Failed to fetch restaurant names.",
//     });
//   }
// };

// const getRestaurantName = async (req, res) => {
//   const restaurantId = req.params.id;

//   try {
//     const restaurantName = await restaurantService.getRestaurantNameById(restaurantId);

//     res.status(200).json({
//       success: true,
//       restaurantName: restaurantName,
//     });
//   } catch (error) {
//     console.error("Error in getRestaurantName:", error.message);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Failed to fetch restaurant name.",
//     });
//   }
// };

// const getRestaurantNameByUserId = async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({
//       success: false,
//       message: "User ID is required",
//     });
//   }

//   try {
//     const restaurantName = await restaurantService.getRestaurantNameByUserId(userId);
//     return res.status(200).json({
//       success: true,
//       restaurantName,
//     });
//   } catch (error) {
//     console.error("Error in getRestaurantNameByUserId:", error.message);
//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Failed to fetch restaurant name.",
//     });
//   }
// };

// // Placeholder login method (assuming you have a login endpoint)
// const loginRestaurant = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Check if user is an Admin (restaurant owner)
//     if (user.userType !== "Admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied: Not a restaurant admin",
//       });
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid password",
//       });
//     }

//     // Fetch restaurant name by userId
//     const restaurantName = await restaurantService.getRestaurantNameByUserId(user.id);

//     // In a real app, you'd generate a JWT token here
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: {
//         user: {
//           id: user.id,
//           email: user.email,
//           username: user.username,
//           userType: user.userType,
//         },
//         restaurantName: restaurantName,
//       },
//     });
//   } catch (error) {
//     console.error("Error in loginRestaurant:", error.message);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Failed to login.",
//     });
//   }
// };

// export {
//   createRestaurant,
//   getAllRestaurants,
//   getRestaurantName,
//   getRestaurantNameByUserId,
//   getRestaurants,
//   loginRestaurant
// };
