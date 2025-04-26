import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const ReservationTable = sequelize.define(
  "ReservationTable",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tableNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "reservationtable",
    timestamps: true,
  }
)

export default ReservationTable
