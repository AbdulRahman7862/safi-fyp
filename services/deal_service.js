// import Deals from "../model/deals.js";
// import ApiError from "../utils/ApiError.js";
// import cloudinary from "../utils/cloudinary.js";

// class DealService {
//   static async createDeal(data, image) {
//     const {
//       deal_name,
//       deal_price,
//       deal_details,
//       deal_category,
//       restaurant_id, 
//     } = data;
  
//     try {
//       if (!restaurant_id) {
//         throw new ApiError(400, "Restaurant ID is required");
//       }
  
//       const restaurant = await Restaurant.findByPk(restaurant_id);
//       if (!restaurant) {
//         throw new ApiError(404, "Restaurant not found");
//       }
  
//       const existingDeal = await Deals.findOne({
//         where: { deal_name },
//       });
  
//       if (existingDeal) {
//         throw new ApiError(400, "Deal already exists for this restaurant");
//       }
  
//       let imageUrl = null;
//       if (image) {
//         const uploadResult = await cloudinary.uploader.upload(image.path);
//         imageUrl = uploadResult.secure_url;
//       }
  
//       const createDeal = await Deals.create({
//         deal_name,
//         deal_category,
//         deal_price,
//         deal_details,
//         image: imageUrl,
//         restaurant_id,  
//       });
  
//       return createDeal; // Return the createDeal directly
//     } catch (error) {
//       throw new ApiError(400, error.message);
//     }
//   }
  
 

//   static async getAllDeals() {
//     try {
//       const deals = await Deals.findAll({})

//       return deals
//     } catch (error) {
//       throw new Error(error.message)
//     }
//   }
// }

// export default DealService
import Deals from "../model/deals.js";

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

    // Optionally, check if the restaurant exists here if you have a Restaurant model
    // const restaurant = await Restaurant.findByPk(restaurant_id);
    // if (!restaurant) {
    //   throw new Error("Restaurant not found");
    // }

    // Check if a deal with the same name exists for this restaurant
    const existingDeal = await Deals.findOne({
      where: { deal_name, restaurant_id },
    });
    if (existingDeal) {
      throw new Error("Deal already exists for this restaurant");
    }

    let imageUrl = null;
    if (image) {
      // If you use cloudinary, uncomment and use the following:
      // const uploadResult = await cloudinary.uploader.upload(image.path);
      // imageUrl = uploadResult.secure_url;
      imageUrl = image.path; // Or however you want to store the image
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
