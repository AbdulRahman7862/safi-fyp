import Deals from "../model/deals.js";
import cloudinary from "../utils/cloudinary.js";

class DealService {
  static async createDeal(data, image) {
    const {
      deal_name,
      deal_price,
      deal_details,
      deal_category,
      restaurant_id,
    } = data;

    if (!restaurant_id) {
      throw new Error("Restaurant ID is required");
    }
    const existingDeal = await Deals.findOne({
      where: { deal_name, restaurant_id },
    });
    if (existingDeal) {
      throw new Error("Deal already exists for this restaurant");
    }

    let imageUrl = null;
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image.path);
      imageUrl = uploadResult.secure_url;
    }

    const createDeal = await Deals.create({
      deal_name,
      deal_category,
      deal_price,
      deal_details,
      image: imageUrl,
      restaurant_id,
    });

    return createDeal;
  }

  static async getAllDeals() {
    try {
      const deals = await Deals.findAll({});
      return deals;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default DealService;
