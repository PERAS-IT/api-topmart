const express = require("express");

const c = require("../controller");
const authenticate = require("../middlewares/authenticate");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validators/validate-auth");
const { validateUserId } = require("../middlewares/validators/validate-userId");
const {
  validateAddressId,
} = require("../middlewares/validators/validate-addressId");
const {
  validateUserAddress,
} = require("../middlewares/validators/validate-userAddress");
const {
  validateProfile,
} = require("../middlewares/validators/validate-userProfile");
const { checkPermission } = require("../middlewares/checkPermission");
const { Role } = require("@prisma/client");

const userRoute = express.Router();

// register
userRoute.post("/register", validateRegister, c.user.register);
// login
userRoute.post("/login", validateLogin, c.user.login);
// get token user
userRoute.get("/", authenticate, c.user.getMe);
// edit profile
userRoute.patch("/profile", authenticate, validateProfile, c.user.editProfile);
// see user profile
userRoute.get("/profile", authenticate, c.user.getUserProfile);
// user delete account
userRoute.patch("/:userId/delete", authenticate, c.user.deleteAccount);
// create user address
userRoute.post(
  "/address",
  authenticate,
  validateUserAddress,
  c.user.createUserAddress
);
// delete user address
userRoute.delete(
  "/address/:addressId",
  authenticate,
  validateAddressId,
  c.user.deleteUserAddress
);
// edit user address
userRoute.patch(
  "/address/:addressId",
  authenticate,
  validateAddressId,
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
  c.user.updateCart
);
// user delete cartItem in cart
userRoute.delete(
  "/cart/:cartItemId",
  authenticate,
  checkPermission(Role.USER),
  c.user.deleteItemInCart
);
// user see all item in cart
userRoute.get("/cart", authenticate, c.user.getAllItemInCart);

// delete user
userRoute.delete("/:userId", authenticate, validateUserId, c.user.delete);
module.exports = userRoute;
