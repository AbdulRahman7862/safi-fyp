import FavoriteRestaurant from "../model/favourite_model.js"
import Restaurant from "../model/restaurant_model.js"

class FavoriteRestaurantService {
  static async addToFavorite(userId, restaurantId) {
    try {
      const existingFavorite = await FavoriteRestaurant.findOne({
        where: { userId, restaurantId },
      })
      if (existingFavorite) {
        throw new Error("Restaurant already in favorites")
      }
      const favorite = await FavoriteRestaurant.create({
        userId,
        restaurantId,
      })
      return favorite
    } catch (error) {
      throw new Error(error.message)
    }
  }
  static async getUserFavorite(userId) {
    try {
      const favorite = await FavoriteRestaurant.findAll({
        where: { userId },
        include: [
          {
            model: Restaurant,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      })

      if (!favorite.length) {
        throw new Error("No favorite restaurants found")
      }

      return favorite
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
export default FavoriteRestaurantService
