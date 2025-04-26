import FavoriteRestaurantService from "../services/favorite_restaurant_service.js"

const addToFavorite = async (req, res) => {
  try {
    const { userId, restaurantId } = req.body
    if (!userId || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Restaurant ID are required",
      })
    }
    const favorite = await FavoriteRestaurantService.addToFavorite(
      userId,
      restaurantId
    )
    res.status(201).json({
      success: true,
      message: "Restaurant added to favorite",
      data: favorite,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

const getUserFavorite = async (req, res) => {
  try {
    const { userId } = req.params

    const favorite = await FavoriteRestaurantService.getUserFavorite(userId)

    res.status(200).json({
      success: true,
      message: "Favorite restaurants fetched successfully",
      data: favorite,
    })
  } catch (error) {
    res.status(404).json({ success: false, message: error.message })
  }
}

export { addToFavorite, getUserFavorite }

