// import { DataTypes } from "sequelize";
// import { sequelize } from "../config/db.js";

// const Deals = sequelize.define(
//   "Deals",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     deal_name: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     deal_price: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     deal_details: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     image: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     deal_category: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     restaurant_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'restaurant', 
//         key: 'id'
//       }
//     }
    
//   },
//   {
//     tableName: "deals",
//     timestamps: true,
//   }
// )



// export default Deals
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

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
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'restaurant_id', // Explicitly map to the database column
      references: {
        model: 'restaurant', // Updated to match your database table name
        key: 'id',
      },
    },
  },
  {
    tableName: "deals",
    timestamps: true,
  }
);

export default Deals;