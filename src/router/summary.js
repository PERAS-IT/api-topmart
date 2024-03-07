const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const { Role } = require("@prisma/client");

const c = require("../controller");

const summaryRoute = express.Router();

summaryRoute.get(
  "/",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.summary.getSummary
);

module.exports = summaryRoute;
