import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"
import Restaurant from "../model/restaurant_model.js"
import User from "../model/user_model.js"

const FavoriteRestaurant = sequelize.define(
  "FavoriteRestaurant",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Restaurant,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "favoriteRestaurant",
    timestamps: true,
  }
)

FavoriteRestaurant.belongsTo(User, { foreignKey: "userId" })
FavoriteRestaurant.belongsTo(Restaurant, { foreignKey: "restaurantId" })

export default FavoriteRestaurant
