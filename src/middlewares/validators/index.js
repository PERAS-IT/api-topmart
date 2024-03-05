const validate = {
  addressId: require("./validate-addressId"),
  auth: require("./validate-auth"),
  cartItemId: require("./validate-cartItemId"),
  productId: require("./validate-productId"),
  transactionId: require("./validate-transactionId"),
  userAddress: require("./validate-userAddress"),
  userId: require("./validate-userId"),
  userProfile: require("./validate-userProfile"),
  paymentItemId: require("./validate-paymentItemId"),
  arrCart: require("./validate-arrCartItem"),
};
module.exports = validate;
