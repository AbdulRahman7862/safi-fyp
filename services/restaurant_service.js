import bcrypt from "bcryptjs"
import Restaurant from "../model/restaurant_model.js"
import Role from "../model/role_model.js"
import User from "../model/user_model.js"
import ApiError from "../utils/ApiError.js"
import cloudinary from "../utils/cloudinary.js"

class RestaurantService {
  async createRestaurant(data, image) {
    try {
      const {
        email,
        password,
        username,
        restaurantData,
        status,
        restaurantId,
      } = data

      // Handle status update for existing restaurant
      if (restaurantId && status) {
        const validStatuses = ["Pending", "Accepted", "Rejected"]
        if (!validStatuses.includes(status)) {
          throw new ApiError(400, "Invalid status value")
        }

        const existingRestaurant = await Restaurant.findByPk(restaurantId)
        if (!existingRestaurant) {
          throw new ApiError(404, "Restaurant not found")
        }

        existingRestaurant.status = status
        await existingRestaurant.save()

        return { message: `Restaurant status updated to ${status}` }
      }

      // Check for existing user
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        throw new ApiError(400, "Email already in use")
      }

      // Find Admin role
      const role = await Role.findOne({ where: { name: "Admin" } })
      if (!role) {
        throw new ApiError(400, "Admin role not found in database")
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10)
      const admin = await User.create({
        username,
        email,
        password: hashedPassword,
        roleId: role.id,
        userType: role.name,
      })

      // Handle image upload
      let imageUrl = null
      if (image) {
        const uploadResult = await cloudinary.uploader.upload(image.path)
        imageUrl = uploadResult.secure_url
      }

      // Parse restaurant data
     const parsedData = typeof restaurantData === "string" ? JSON.parse(restaurantData) : restaurantData;

      if (!parsedData.restaurantName || !parsedData.restaurantAddress) {
        throw new ApiError(400, "Restaurant name and address are required.")
      }

      // Store socialMediaLinks as a JSON array
      const socialMediaLinks = Array.isArray(parsedData.socialMediaLinks)
        ? parsedData.socialMediaLinks
        : parsedData.socialMediaLinks
        ? [parsedData.socialMediaLinks]
        : []

      const restaurant = await Restaurant.create({
        restaurantName: String(parsedData.restaurantName),
        restaurantAddress: String(parsedData.restaurantAddress),
        websiteUrl: parsedData.websiteUrl || null,
        socialMediaLinks: socialMediaLinks,  
        restaurantType: parsedData.restaurantType
          ? JSON.stringify(parsedData.restaurantType)
          : JSON.stringify([]),
        operationalHours: String(parsedData.operationalHours || ""),
        minPriceRange: Number(parsedData.minPriceRange || 0),
        maxPriceRange: Number(parsedData.maxPriceRange || 0),
        acceptReservation: String(parsedData.acceptReservation || "No"),
        restaurantMinDays: Number(parsedData.restaurantMinDays || 0),
        restaurantMinHours: Number(parsedData.restaurantMinHours || 0),
        restaurantFeatures: parsedData.restaurantFeatures
          ? JSON.stringify(parsedData.restaurantFeatures)
          : JSON.stringify([]),
        restaurantInfo: parsedData.restaurantInfo
          ? JSON.stringify(parsedData.restaurantInfo)
          : JSON.stringify({}),
        additionalNotes: parsedData.additionalNotes
          ? String(parsedData.additionalNotes)
          : null,
        userId: admin.id,
        status: "Accepted",
        image: imageUrl,
      })

      return {
        success: true,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          userType: admin.userType,
        },
        restaurant: {
          id: restaurant.id,
          restaurantName: restaurant.restaurantName,
          restaurantAddress: restaurant.restaurantAddress,
          websiteUrl: restaurant.websiteUrl,
          socialMediaLinks: restaurant.socialMediaLinks,  
          restaurantType: restaurant.restaurantType,
          operationalHours: restaurant.operationalHours,
          minPriceRange: restaurant.minPriceRange,
          maxPriceRange: restaurant.maxPriceRange,
          acceptReservation: restaurant.acceptReservation,
          restaurantMinDays: restaurant.restaurantMinDays,
          restaurantMinHours: restaurant.restaurantMinHours,
          restaurantFeatures: restaurant.restaurantFeatures,
          restaurantInfo: restaurant.restaurantInfo,
          additionalNotes: restaurant.additionalNotes,
          image: restaurant.image,
          status: restaurant.status,
        },
      }
    } catch (error) {
      throw new ApiError(400, error.message || "Error creating restaurant")
    }
  }

  async getAllRestaurants() {
    try {
      const restaurants = await Restaurant.findAll({
        where: { status: "Accepted" },
      })

      if (!restaurants || restaurants.length === 0) {
        throw new ApiError(404, "No accepted restaurants found")
      }

      return {
        success: true,
        message: "Accepted restaurants retrieved successfully",
        data: restaurants,
      }
    } catch (error) {
      console.error("Error fetching accepted restaurants:", error)
      throw new ApiError(
        500,
        error.message || "An unexpected error occurred, Please try again"
      )
    }
  }

  async getAllRestaurantNames() {
    try {
      const restaurants = await Restaurant.findAll({
        attributes: ["restaurantName"],
        raw: true,
      })

      const restaurantNames = restaurants.map(
        (restaurant) => restaurant.restaurantName
      )

      if (!restaurantNames.length) {
        throw new ApiError(404, "No restaurant names found")
      }

      return restaurantNames
    } catch (error) {
      throw new ApiError(
        500,
        "Error fetching restaurant names: " + error.message
      )
    }
  }

  async getRestaurantNameById(restaurantId) {
    try {
      const restaurant = await Restaurant.findByPk(restaurantId, {
        attributes: ["restaurantName"],
      })

      if (!restaurant) {
        throw new ApiError(404, "Restaurant not found")
      }

      return restaurant.restaurantName
    } catch (error) {
      throw new ApiError(
        500,
        "Error fetching restaurant name: " + error.message
      )
    }
  }

  async getRestaurantNameByUserId(userId) {
    try {
      console.log("Searching for userId:", userId)
      const restaurant = await Restaurant.findOne({
        where: { userId },
        attributes: ["restaurantName"],
      })

      if (!restaurant) {
        throw new ApiError(404, "Restaurant not found for this user")
      }

      return restaurant.restaurantName
    } catch (error) {
      console.error("Error in getRestaurantNameByUserId:", error.message)
      throw new ApiError(
        500,
        "Error fetching restaurant name: " + error.message
      )
    }
  }
}

export default RestaurantService
