const express = require("express");

const c = require("../controller");
const { uploadMiddlewareLanding } = require("../middlewares/upload");

const landingRoute = express.Router();

//=======================================LANDING PAGE=====
landingRoute.get("/", c.landing.getLanding);
landingRoute.post("/upload", uploadMiddlewareLanding, c.landing.uploadLanding);
landingRoute.post("/delete/:landingId", c.landing.deleteLanding);
landingRoute.post("/delete/multi", c.landing.deleteMultiLanding);

module.exports = landingRoute;
