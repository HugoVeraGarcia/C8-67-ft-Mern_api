// Models
const { User } = require('./user.model');
const { Product } = require('./product.model');
const { Cart } = require('./cart.model');
const { Order } = require('./order.model');
const { ProductInCart } = require('./productInCart.model');
const { ProductImg } = require('./productImg.model');
const { Category } = require('./category.model');
const { Enterprise } = require('./enterprise.model');
const { userEnterprise } = require('./userEnterprise.model');

const initModels = () => {
  // one user <–—> many product
  User.hasMany(Product);
  Product.belongsTo(User);

  //one enterprise <–—> many userEnterprise
  Enterprise.hasMany(userEnterprise);
  userEnterprise.belongsTo(Enterprise);

  //one enterprise <–—> many users  //clients
  Enterprise.hasMany(User);
  User.belongsTo(Enterprise);

  //one enterprise <–—> many products
  Enterprise.hasMany(Product);
  Product.belongsTo(Enterprise);

  //one enterprise <–—> many categories
  Enterprise.hasMany(Category);
  Category.belongsTo(Enterprise);

  //one enterprise <–—> many orders
  Enterprise.hasMany(Order);
  Order.belongsTo(Enterprise);

  //one enterprise <–—> many carts
  Enterprise.hasMany(Cart);
  Cart.belongsTo(Enterprise);

  //one enterprise <–—> many productImg
  Enterprise.hasMany(ProductImg);
  ProductImg.belongsTo(Enterprise);

  //one enterprise <–—> many productInCart
  Enterprise.hasMany(ProductInCart);
  ProductInCart.belongsTo(Enterprise);

  // one user <---> many order
  User.hasMany(Order);
  Order.belongsTo(User);

  // one user <---> one cart
  User.hasOne(Cart);
  Cart.belongsTo(User);

  // one product <---> many productImg
  Product.hasMany(ProductImg);
  ProductImg.belongsTo(Product);

  // one product <---> one productInCart
  Product.hasOne(ProductInCart);
  ProductInCart.belongsTo(Product);

  // one Category <---> many product
  Category.hasMany(Product);
  Product.belongsTo(Category);

  // one cart <---> many productInCart
  Cart.hasMany(ProductInCart);
  ProductInCart.belongsTo(Cart);

  // one cart <---> one order
  Cart.hasOne(Order);
  Order.belongsTo(Cart);
};

module.exports = { initModels };
