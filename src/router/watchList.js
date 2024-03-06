const express = require("express");
const c = require("../controller");
const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const { Role } = require("@prisma/client");

const watchListRoute = express.Router();

watchListRoute.get(
  "/",
  authenticate,
  checkPermission(Role.USER),
  c.watchList.getWatchList
);
watchListRoute.post(
  "/create/:productId",
  authenticate,
  checkPermission(Role.USER),
  c.watchList.createWatchList
);
watchListRoute.post(
  "/delete/:watchListId",
  authenticate,
  checkPermission(Role.USER),
  c.watchList.deleteWatchList
);
module.exports = watchListRoute;
