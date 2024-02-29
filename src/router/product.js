const express = require("express");

const c = require("../controller");

const productRoute = express.Router();

productRoute.get("/");
productRoute.get("/:id");
productRoute.post("/create-series", c.product.createProductSeries);
productRoute.post("/create-class", c.product.createProductSeries);
productRoute.post("/create-product", c.product.createProduct);

module.exports = productRoute;
