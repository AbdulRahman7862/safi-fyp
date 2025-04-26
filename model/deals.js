import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const Deals = sequelize.define(
  "Deals",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    deal_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    deal_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deal_details: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    deal_category: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    restaurant_id : {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    tableName: "deals",
    timestamps: true,
  }
)

export default Deals
