const express = require("express");

const c = require("../controller");
const { uploadMiddleware } = require("../middlewares/upload");

const productRoute = express.Router();

productRoute.get("/group_product", c.product.getAllGroup); // tcp
productRoute.get("/series", c.product.getAllSeries); // tcp

productRoute.get("/", c.product.getAllProduct);
productRoute.get("/:productId", c.product.getProductById);
productRoute.post("/create_series", c.product.createProductSeries);
productRoute.post("/create_group", c.product.createProductGroup);
productRoute.post("/create_product", uploadMiddleware, c.product.createProduct);
productRoute.post("/delete_image/:imageId", c.product.deleteImage);
productRoute.post("/delete_product/:productId", c.product.deleteProduct);
module.exports = productRoute;
