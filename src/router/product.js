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
productRoute.get("/series", c.product.getAllSeries);
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
productRoute.get("/group", c.product.getAllGroup);
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
//get All
productRoute.get("/", c.product.getAllProduct); // for get card
//GET BY ID
productRoute.get("/:productId", c.product.getProductById); // for get product

//CREATE PRODUCT
productRoute.post(
  "/create",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  uploadMiddlewareCreateProduct,
  v.addProduct.validateAddProduct,
  c.product.createProduct
); // test
// HEARD DELETE PRODUCT
productRoute.post(
  "/delete/:productId",
  authenticate,
  checkPermission(Role.SUPERADMIN),
  c.product.deleteProduct
); // not open
// SOFT DELETE PRODUCT
productRoute.patch(
  "/inactive/:productId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.deleteSoft
);
// UPDATE PRODUCT
productRoute.patch(
  "/update/:productId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  v.addProduct.validateAddProduct,
  c.product.editProduct
);

// UPDATE QUANTITY
productRoute.patch(
  "/update_quantity/:productId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.updateQuantity
);

//=======================================COVER=====
productRoute.post(
  "/update_cover/:coverId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  uploadMiddlewareSingle,
  c.product.updateCover
);
productRoute.post(
  "/delete_cover/:coverId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.deleteCover
);
//=======================================IMAGE=====
productRoute.post(
  "/upload_image/:productId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  uploadMiddlewareSingle,
  c.product.createImage
);
productRoute.post(
  "/delete_image/:imageId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.deleteImage
);

//========================================POSTER====
// update Poster
//1
productRoute.patch(
  "/upload_poster1/:posterId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  uploadMiddlewareSingle,
  c.product.updatePoster1
);
//2
productRoute.patch(
  "/upload_poster2/:posterId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  uploadMiddlewareSingle,
  c.product.updatePoster2
);
//3
productRoute.patch(
  "/upload_poster3/:posterId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  uploadMiddlewareSingle,
  c.product.updatePoster3
);
//4
productRoute.patch(
  "/upload_poster4/:posterId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  uploadMiddlewareSingle,
  c.product.updatePoster4
);
//5
productRoute.patch(
  "/upload_poster5/:posterId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  uploadMiddlewareSingle,
  c.product.updatePoster5
);
// delete Poster
//1
productRoute.patch(
  "/delete_poster1/:posterId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.deletePoster1
);
//2
productRoute.patch(
  "/delete_poster2/:posterId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.deletePoster2
);
//3
productRoute.patch(
  "/delete_poster3/:posterId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.deletePoster3
);
//4
productRoute.patch(
  "/delete_poster4/:posterId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.deletePoster4
);
//5
productRoute.patch(
  "/delete_poster5/:posterId",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.product.deletePoster5
);

module.exports = productRoute;
