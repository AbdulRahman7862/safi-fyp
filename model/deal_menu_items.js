import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"
const DealMenuItem = sequelize.define(
  "DealMenuItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    menu_item_id: {
      type: DataTypes.INTEGER,
      required: true,
    },
  },
  {
    tableName: "dealsMenuItem",
    timestamps: true,
  }
)
export default DealMenuItem
