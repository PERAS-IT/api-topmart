const express = require("express");

const liveChatRoute = express.Router();

liveChatRoute.post("/send/:id");
module.exports = liveChatRoute;
