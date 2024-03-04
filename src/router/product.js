const express = require("express");

const c = require("../controller");
const { uploadMiddlewareCreateProduct } = require("../middlewares/upload");

const productRoute = express.Router();

//=======================================SERIES======
productRoute.get("/series", c.product.getAllSeries);
productRoute.post("/series/create", c.product.createProductSeries);
productRoute.patch("/series/:seriesId", c.product.editProductSeries);
//=======================================GROUP=======
productRoute.get("/group", c.product.getAllGroup);
productRoute.post("/group/create", c.product.createProductGroup);
productRoute.patch("/group/:groupId", c.product.editGroup);
//=======================================PRODUCT=====
productRoute.get("/", c.product.getAllProduct); //
productRoute.get("/:productId", c.product.getProductById); //
productRoute.post(
  "/create",
  uploadMiddlewareCreateProduct,
  c.product.createProduct
);
productRoute.post("/delete/:productId", c.product.deleteProduct);

//=======================================IMAGE=====
productRoute.post("/upload_image");
productRoute.post("/delete_image/:imageId", c.product.deleteImage);
module.exports = productRoute;
