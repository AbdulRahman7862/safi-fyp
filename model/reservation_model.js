import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "../model/user_model.js";
import Restaurant from "./restaurant_model.js";

const Reservation = sequelize.define(
  "Reservation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: "users",  
        key: "id",
      },
      onDelete: "SET NULL",  
      onUpdate: "CASCADE",
    },
    reservationTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reservationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    numberOfPersons: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tableNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reservationStatus: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Pending",
    },
    // restaurantId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Or true if you allow restaurant deletion
      references: {
        model: 'restaurant', // exact table name
        key: 'id',
      },
      onDelete: 'CASCADE', // or 'RESTRICT' or 'NO ACTION'
      onUpdate: 'CASCADE',
    },
    deal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additionalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "reservations",
    timestamps: true,
  }
);

export default Reservation;
 