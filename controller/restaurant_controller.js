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
    const restaurants = await restaurantService.getAllRestaurantNames();
    res.status(200).json({
      success: true,
      data: restaurants, // This will now include both id and restaurantName
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch restaurant names",
    });
  }
};

// const getRestaurants = async (req, res) => {
//   try {
//     const restaurants = await restaurantService.getAllRestaurantNames()
//     res.status(200).json(restaurants)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }

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
