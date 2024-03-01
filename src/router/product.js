const express = require("express");

const c = require("../controller");
const { uploadMiddleware } = require("../middlewares/upload");

const productRoute = express.Router();

productRoute.get("/", c.product.getAllProduct);
productRoute.get("/:productId", c.product.getProductById);
productRoute.post("/create_series", c.product.createProductSeries);
productRoute.post("/create_group", c.product.createProductGroup);
productRoute.post("/create_product", uploadMiddleware, c.product.createProduct);

module.exports = productRoute;
