const express = require("express");

const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const { Role } = require("@prisma/client");

const c = require("../controller");
const { uploadMiddlewareLanding } = require("../middlewares/upload");

const landingRoute = express.Router();

//=======================================LANDING PAGE=====
landingRoute.get("/", c.landing.getLanding.getLanding);
landingRoute.post(
  "/upload",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  uploadMiddlewareLanding,
  c.landing.uploadLanding
);
landingRoute.delete(
  "/delete/:landingId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.landing.deleteLanding
);
// landingRoute.post(
//   "/delete/multi",
//   authenticate,
//   checkPermission(Role.ADMIN, Role.SUPERADMIN),
//   c.landing.deleteMultiLanding
// );

module.exports = landingRoute;
