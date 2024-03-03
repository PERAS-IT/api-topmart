const express = require("express");

const c = require("../controller");
const { uploadMiddleware } = require("../middlewares/upload");

const productRoute = express.Router();

//=======================================SERIES======
productRoute.get("/series", c.product.getAllSeries);
productRoute.post("/series/create", c.product.createProductSeries);
productRoute.patch("/series/:seriesId", c.product.editProductSeries);
//=======================================GROUP=======
productRoute.get("/group_product", c.product.getAllGroup);
productRoute.post("/group_product/create", c.product.createProductGroup);
productRoute.patch("/group_product/:groupId", c.product.editGroup);
//=======================================PRODUCT=====
productRoute.get("/", c.product.getAllProduct);
productRoute.get("/:productId", c.product.getProductById);
productRoute.post("/create_series", c.product.createProductSeries);
productRoute.post("/create_group", c.product.createProductGroup);
productRoute.post("/create_product", uploadMiddleware, c.product.createProduct);
productRoute.post("/delete_image/:imageId", c.product.deleteImage);
productRoute.post("/delete_product/:productId", c.product.deleteProduct);
module.exports = productRoute;
