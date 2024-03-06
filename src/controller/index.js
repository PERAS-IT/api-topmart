const controller = {
  user: require("./user"),
  admin: require("./admin"),
  product: require("./product"),
  cart: require("./cart"),
  transaction: require("./transaction"),
  landing: require("./landing"),
  itemPayment: require("./item-payment"),
  reward: require("./reward"),
};
module.exports = controller;
