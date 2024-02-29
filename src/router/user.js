const express = require("express");

const c = require("../controller");
const authenticate = require("../middlewares/authenticate");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validators/validate-auth");

const userRoute = express.Router();

// userRoute.get("/", c.user.getAll);
// userRoute.get("/:id", c.user.get);
userRoute.post("/register", validateRegister, c.user.register);
userRoute.post("/login", validateLogin, c.user.login);
userRoute.get("/", authenticate, c.user.getMe);
// userRoute.put("/:id", c.user.update);
userRoute.delete("/:id", authenticate, c.user.delete);

module.exports = userRoute;
