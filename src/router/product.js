const express = require("express");

const c = require("../controller");
const { uploadMiddleware } = require("../middlewares/upload");

const productRoute = express.Router();

productRoute.get("/");
productRoute.get("/:id");
productRoute.post("/create_series", c.product.createProductSeries);
productRoute.post("/create_class", c.product.createProductSeries);
productRoute.post("/create_product", uploadMiddleware, c.product.createProduct);

module.exports = productRoute;
