const { Deals } = require("./deals")
const { DealsCategory } = require("./dealscategory")

Deals.belongsTo(DealsCategory, {
  foreignKey: "dealCategoryId",
  as: "category",
})
DealsCategory.hasMany(Deals, {
  foreignKey: "dealCategoryId",
})
