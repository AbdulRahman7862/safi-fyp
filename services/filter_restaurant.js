import { Op } from "sequelize";
import Area from "../model/area_model.js";
import Deals from "../model/deals.js";
import Restaurant from "../model/restaurant_model.js";

export const filterRestaurants = async (filters) => {
  try {
    const { minPrice, maxPrice, restaurantType, deals, area, additionalNotes } = filters;

    const restaurants = await Restaurant.findAll({
      where: {
        minPriceRange: { [Op.gte]: minPrice },
        maxPriceRange: { [Op.lte]: maxPrice },
        restaurantType: { [Op.like]: `%${restaurantType}%` },
        additionalNotes: { [Op.like]: `%${additionalNotes}%` },
      },
      include: [
        {
          model: Deals,
          where: deals ? { deal_name: { [Op.like]: `%${deals}%` } } : {},
          required: deals ? true : false,
        },
        {
          model: Area,
          where: area ? { area_name: { [Op.like]: `%${area}%` } } : {},
          required: area ? true : false,
        },
      ],
    });

    return restaurants;
  } catch (error) {
    throw new Error("Error fetching filtered restaurants: " + error.message);
  }
};

export default filterRestaurants