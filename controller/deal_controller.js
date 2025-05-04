// import DealService from "../services/deal_service.js";

// const createDeal = async (req, res) => {
//   try {
//     console.log("Request body:", req.body); // Add this to debug
//     const addDeal = await DealService.createDeal(req.body, req.file);
//     res.status(200).json({
//       message: "Deal added successfully",
//       data: addDeal,
//     });
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(400).json({
//       success: false,
//       message: error.message || "Error creating deal",
//     });
//   }
// };

// // const createDeal = async (req, res) => {
// //   try {
// //     const addDeal = await DealService.createDeal(req.body, req.file)
// //     res.status(200).json({
// //       message: "Deal added successfully",
// //       data: addDeal,
// //     })
// //   } catch (error) {
// //     console.error("Error:", error.message)
// //     res.status(400).json({
// //       success: false,
// //       message: error.message || "Error creating deal",
// //     })
// //   }
// // }

// const getAllDeals = async (req, res) => {
//   try {
//     const deals = await DealService.getAllDeals()
//     res.status(200).json(deals)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }

// export { createDeal, getAllDeals };

import DealService from "../services/deal_service.js";

const createDeal = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug
    const addDeal = await DealService.createDeal(req.body, req.file);
    res.status(200).json({
      message: "Deal added successfully",
      data: {
        id: addDeal.id,
        deal_name: addDeal.deal_name,
        deal_price: addDeal.deal_price,
        deal_details: addDeal.deal_details,
        deal_category: addDeal.deal_category,
        image: addDeal.image,
        restaurant_id: addDeal.restaurant_id,  
        createdAt: addDeal.createdAt,
        updatedAt: addDeal.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Error creating deal",
    });
  }
};

const getAllDeals = async (req, res) => {
  try {
    const deals = await DealService.getAllDeals();
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createDeal, getAllDeals };

