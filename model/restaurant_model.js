import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const Restaurant = sequelize.define(
  "Restaurant",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    restaurantName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    restaurantAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    websiteUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Invalid website URL format.",
        },
      },
    },
    socialMediaLinks: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    restaurantType: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    operationalHours: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    minPriceRange: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxPriceRange: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acceptReservation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["Yes", "No"]],  
      },
    },
    
    restaurantMinDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    restaurantMinHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    restaurantFeatures: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    restaurantInfo: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    additionalNotes: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "restaurant",
    timestamps: true,
  }
)

export default Restaurant
