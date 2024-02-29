const { Router } = require("express");

const c = require("../controller");
const authenticate = require("../middlewares/authenticate");
const checkPermission = require("../middlewares/checkPermission");

const adminRoute = Router();

adminRoute.post(
  "/register",
  authenticate,
  checkPermission("SUPERADMIN"),
  c.admin.register
);
