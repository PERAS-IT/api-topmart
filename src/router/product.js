const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const { Role } = require("@prisma/client");

const c = require("../controller");
const v = require("../middlewares/validators");
const {
  uploadMiddlewareCreateProduct,
  uploadMiddlewareSingle,
  uploadMiddlewareLanding,
} = require("../middlewares/upload");

const productRoute = express.Router();

//=======================================SERIES======
productRoute.get(
  "/series",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.getAllSeries
);
productRoute.post(
  "/series/create",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.createProductSeries
);
productRoute.patch(
  "/series/:seriesId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.editProductSeries
);
//=======================================GROUP=======
productRoute.get(
  "/group",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.getAllGroup
);
productRoute.post(
  "/group/create",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.createProductGroup
);
productRoute.patch(
  "/group/:groupId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.editGroup
);

//=======================================PRODUCT=====
productRoute.get("/", c.product.getAllProduct); // for get card
productRoute.get("/:productId", c.product.getProductById); // for get product
productRoute.get("/");
productRoute.post(
  "/create",
  uploadMiddlewareCreateProduct,
  v.addProduct.validateAddProduct,
  c.product.createProduct
); // test
productRoute.post("/delete/:productId", c.product.deleteProduct); // not open
productRoute.patch("/inactive/:productId", c.product.deleteSoft);

//=======================================COVER=====
productRoute.post(
  "/update_cover/:coverId",
  uploadMiddlewareSingle,
  c.product.updateCover
);
productRoute.post("/delete_cover/:coverId", c.product.deleteCover);
//=======================================IMAGE=====
productRoute.post(
  "/upload_image/:productId",
  uploadMiddlewareSingle,
  c.product.createImage
);
productRoute.post("/delete_image/:imageId", c.product.deleteImage);

//========================================POSTER====
productRoute.patch(
  "/upload_poster1/:productId",
  uploadMiddlewareSingle,
  c.product.createPoster1
);
productRoute.patch(
  "/upload_poster2/:productId",
  uploadMiddlewareSingle,
  c.product.createPoster2
);
productRoute.patch(
  "/upload_poster3/:productId",
  uploadMiddlewareSingle,
  c.product.createPoster3
);
productRoute.patch(
  "/upload_poster4/:productId",
  uploadMiddlewareSingle,
  c.product.createPoster4
);
productRoute.patch(
  "/upload_poster5/:productId",
  uploadMiddlewareSingle,
  c.product.createPoster5
);

productRoute.patch("/delete_poster1/:posterId", c.product.deletePoster1);
productRoute.patch("/delete_poster2/:posterId", c.product.deletePoster2);
productRoute.patch("/delete_poster3/:posterId", c.product.deletePoster3);
productRoute.patch("/delete_poster4/:posterId", c.product.deletePoster4);
productRoute.patch("/delete_poster5/:posterId", c.product.deletePoster5);

//========================================NEW ARRIVAL====

module.exports = productRoute;
