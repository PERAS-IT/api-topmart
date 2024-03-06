const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const v = require("../middlewares/validators");
const c = require("../controller");
const { Role } = require("@prisma/client");

const cartRoute = express.Router();

// user add cartItem in cart
cartRoute.patch(
  "/",
  authenticate,
  checkPermission(Role.USER),
  c.cart.updateCart
);
// user delete cartItem in cart
cartRoute.delete(
  "/:cartItemId",
  authenticate,
  checkPermission(Role.USER),
  v.cartItemId.validateCartItemId,
  c.cart.deleteItemInCart
);
// user see all item in cart
cartRoute.get("/", authenticate, c.cart.getAllItemInCart);

module.exports = cartRoute;
