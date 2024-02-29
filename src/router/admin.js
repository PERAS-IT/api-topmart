const { Router } = require("express");

const c = require("../controller");
const authenticate = require("../middlewares/authenticate");
const checkPermission = require("../middlewares/checkPermission");
const {
  validateLogin,
  validateRegister,
} = require("../middlewares/validators/validate-auth");

const adminRoute = Router();

adminRoute.post(
  "/register",
  authenticate,
  checkPermission("SUPERADMIN"),
  validateRegister,
  c.admin.register
);

adminRoute.post("/login", validateLogin, c.admin.login);

adminRoute.get(
  "/allUser",
  authenticate,
  checkPermission("ADMIN"),
  c.admin.getAllUser
);

adminRoute.get(
  "/allAdmin",
  authenticate,
  checkPermission("SUPERADMIN", c.admin.getAllAdmin)
);
