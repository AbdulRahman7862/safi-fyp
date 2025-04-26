import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
      maxlength: 255,
    },
    description: {
      type: DataTypes.STRING,
      maxlength: 255,
    },
  },
  {
    tableName: "role",
    timestamps: true,
  }
)

export default Role
