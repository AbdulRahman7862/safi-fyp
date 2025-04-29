import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber:{
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    tableName: "users",
    timestamps: true,
  }
)

export default User
