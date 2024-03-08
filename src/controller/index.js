const controller = {
  user: require("./user"),
  admin: require("./admin"),
  product: require("./product"),
  cart: require("./cart"),
  transaction: require("./transaction"),
  landing: require("./landing"),
  itemPayment: require("./item-payment"),
  reward: require("./reward"),
  watchList: require("./watchList"),
  statusProduct: require("./status-product"),
  summary: require("./summary"),
  getProduct: require("./get-product"),
  liveChat: require("./live-chat"),
  payment: require("./payment"),
};
module.exports = controller;
