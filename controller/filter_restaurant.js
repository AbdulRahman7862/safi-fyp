import { Op } from "sequelize";
import Restaurant from "../model/restaurant_model.js";

export const filterRestaurants = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    
    const {
      minPrice,
      maxPrice,
      restaurantType,
      deal,
      restaurantArea,
      additionalNotes,
    } = req.body

    const whereClause = {}
    if (minPrice !== undefined)
      whereClause.minPriceRange = { [Op.gte]: minPrice }
    if (maxPrice !== undefined)
      whereClause.maxPriceRange = { [Op.lte]: maxPrice }
    if (restaurantType)
      whereClause.restaurantType = { [Op.like]: `%${restaurantType}%` }
    if (additionalNotes)
      whereClause.additionalNotes = { [Op.like]: `%${additionalNotes}%` }

    const restaurants = await Restaurant.findAll({
      where: whereClause,
 
    })

    return res.status(200).json({ restaurants })
  } catch (error) {
    console.error("Error fetching filtered restaurants:", error)
    return res
      .status(500)
      .json({
        error: "Error fetching filtered restaurants",
        details: error.message,
        message: "No restaurant matches this details",
      })
  }
}

export default filterRestaurants
