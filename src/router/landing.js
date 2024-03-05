const express = require("express");

const c = require("../controller");
const { uploadMiddlewareLanding } = require("../middlewares/upload");

const landingRoute = express.Router();

//=======================================LANDING PAGE=====
landingRoute.post(
  "/upload_landing",
  uploadMiddlewareLanding,
  c.landing.uploadLanding
);

landingRoute.post("/delete_landing", c.landing.deleteLanding);

module.exports = landingRoute;
