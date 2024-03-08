const express = require("express");
const c = require("../controller");
const liveChatRoute = express.Router();
const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const { Role } = require("@prisma/client");

liveChatRoute.post(
  "/send/:id",
  authenticate,
  checkPermission(Role.USER, Role.ADMIN, Role.SUPERADMIN),
  c.liveChat.sendMessage
);
module.exports = liveChatRoute;
