// const { sequelize } = require("../config/db")
// const { DataTypes } = require("sequelize")
import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"
const SeatingTable = sequelize.define(
  "SeatingTable",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    table_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    table_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "seating_table",
    timestamps: true,
  }
)

// module.exports = { SeatingTable }
export default SeatingTable
