const DataTypes = require("sequelize").DataTypes;
const _Order = require("./Order");
const _OrderDetails = require("./OrderDetails");
const _Product = require("./Product");
const _ProductCategory = require("./ProductCategory");
const _ShoppingCart = require("./ShoppingCart");
const _Users = require("./Users");

function initModels(sequelize) {
  const Order = _Order(sequelize, DataTypes);
  const OrderDetails = _OrderDetails(sequelize, DataTypes);
  const Product = _Product(sequelize, DataTypes);
  const ProductCategory = _ProductCategory(sequelize, DataTypes);
  const ShoppingCart = _ShoppingCart(sequelize, DataTypes);
  const Users = _Users(sequelize, DataTypes);

  OrderDetails.belongsTo(Order, { as: "order", foreignKey: "order_id"});
  Order.hasMany(OrderDetails, { as: "OrderDetails", foreignKey: "order_id"});
  OrderDetails.belongsTo(Product, { as: "product", foreignKey: "product_id"});
  Product.hasMany(OrderDetails, { as: "OrderDetails", foreignKey: "product_id"});
  ShoppingCart.belongsTo(Product, { as: "product", foreignKey: "product_id"});
  Product.hasMany(ShoppingCart, { as: "ShoppingCarts", foreignKey: "product_id"});
  Product.belongsTo(ProductCategory, { as: "category", foreignKey: "category_id"});
  ProductCategory.hasMany(Product, { as: "Products", foreignKey: "category_id"});
  Order.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Order, { as: "Orders", foreignKey: "user_id"});
  ShoppingCart.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(ShoppingCart, { as: "ShoppingCarts", foreignKey: "user_id"});

  return {
    Order,
    OrderDetails,
    Product,
    ProductCategory,
    ShoppingCart,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
