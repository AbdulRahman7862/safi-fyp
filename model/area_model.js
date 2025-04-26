import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"
const Area = sequelize.define(
  "Area",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    area_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    restaurant_id : {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    tableName: "area",
    timestamps: true,
  }
)

export default Area
