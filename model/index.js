const { Deals } = require("./deals")
const { DealsCategory } = require("./dealscategory")
const Restaurant = require("./restaurant_model")

Deals.belongsTo(DealsCategory, {
  foreignKey: "dealCategoryId",
  as: "category",
})
DealsCategory.hasMany(Deals, {
  foreignKey: "dealCategoryId",
})

Deals.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant"
})

Restaurant.hasMany(Deals, {
  foreignKey: "restaurant_id",
  as: "deals"
})
