const express = require("express");
const c = require("../controller");

const statusProductRoute = express.Router();

//========================================NEW ARRIVAL====

statusProductRoute.get("/new-arrival", c.statusProduct.getNewArrivalProduct);

module.exports = statusProductRoute;
