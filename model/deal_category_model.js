import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"
const DealsCategory = sequelize.define(
  "DealsCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "dealscategory",
    timestamps: true,
  }
)
export default DealsCategory
