const express = require("express");
const c = require("../controller");
const liveChatRoute = express.Router();
const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const { Role } = require("@prisma/client");

liveChatRoute.get(
  "/get",
  authenticate,
  checkPermission(Role.USER),
  c.liveChat.getMessage
);
liveChatRoute.get(
  "/getAdmin/:userId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.liveChat.getMessageForAdmin
);
liveChatRoute.get("/getUser");
module.exports = liveChatRoute;
