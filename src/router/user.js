const express = require("express");

const c = require("../controller");
const v = require("../middlewares/validators");
const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const { Role } = require("@prisma/client");

const userRoute = express.Router();

// register
userRoute.post("/register", v.auth.validateRegister, c.user.register);
// login
userRoute.post("/login", v.auth.validateLogin, c.user.login);
// get token user
userRoute.get("/", authenticate, c.user.getMe);
// edit profile
userRoute.patch(
  "/profile",
  authenticate,
  v.userProfile.validateProfile,
  c.user.editProfile
);
// see user profile
userRoute.get("/profile", authenticate, c.user.getUserProfile);
// user delete account
userRoute.patch("/:userId/delete", authenticate, c.user.deleteAccount);
// create user address
userRoute.post(
  "/address",
  authenticate,
  v.userAddress.validateUserAddress,
  c.user.createUserAddress
);
// delete user address
userRoute.delete(
  "/address/:addressId",
  authenticate,
  v.addressId.validateAddressId,
  c.user.deleteUserAddress
);
// edit user address
userRoute.patch(
  "/address/:addressId",
  authenticate,
  v.addressId.validateAddressId,
  c.user.editUserAddress
);
// see all user Address
userRoute.get("/address/all", authenticate, c.user.getAllUserAddress);
// user subscribe web
userRoute.patch("/subscribe", authenticate, c.user.subscribeWeb);
// user add cartItem in cart
userRoute.patch(
  "/cart",
  authenticate,
  checkPermission(Role.USER),
  c.cart.updateCart
);
// user delete cartItem in cart
userRoute.delete(
  "/cart/:cartItemId",
  authenticate,
  checkPermission(Role.USER),
  v.cartItemId.validateCartItemId,
  c.cart.deleteItemInCart
);
// user see all item in cart
userRoute.get("/cart", authenticate, c.cart.getAllItemInCart);
// user create transaction
userRoute.post(
  "/transaction/:cartItemId",
  authenticate,
  checkPermission(Role.USER),
  v.arrCart.validateArrCart,
  c.transaction.createTransaction
);
// update transaction user
userRoute.patch(
  "/transaction/:transactionId",
  authenticate,
  checkPermission(Role.USER),
  v.transactionId.validateTransactionId,
  c.transaction.updateTransaction
);
// user see transaction
userRoute.get(
  "/transaction",
  authenticate,
  c.transaction.getTransactionByUserId
);

// delete user for backend
userRoute.delete(
  "/:userId",
  authenticate,
  v.userId.validateUserId,
  c.user.delete
);
// delete transaction for backend
userRoute.delete(
  "/transaction/:transactionId",
  authenticate,
  v.transactionId.validateTransactionId,
  c.transaction.deleteTransaction
);
// delete itemPayment for backend
userRoute.delete(
  "/paymentItem/:itemPaymentId",
  authenticate,
  v.paymentItemId.validatepaymentItemId,
  c.itemPayment.deleteItemPayment
);

module.exports = userRoute;
