const express = require("express");
const c = require("../controller");

const statusProductRoute = express.Router();

//========================================NEW ARRIVAL====

statusProductRoute.get("/new-arrival", c.statusProduct.getNewArrivalProduct);
//========================================LAUNCH CALENDER====
statusProductRoute.get(
  "/launch-calender",
  c.statusProduct.getLaunchCalenderProduct
);

module.exports = statusProductRoute;
