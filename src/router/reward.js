const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const { Role } = require("@prisma/client");

const c = require("../controller");

const rewardRoute = express.Router();

rewardRoute.get(
  "/",
  authenticate,
  checkPermission(Role.USER),
  c.reward.getRewardUser
);

module.exports = rewardRoute;
