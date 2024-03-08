const express = require("express");
const c = require("../controller");

const getProductRoute = express.Router();

getProductRoute.get("/bySeries/:seriesId", c.getProduct.getProductBySeriesId);
getProductRoute.get("/byGroup/:groupName", c.getProduct.getProductByGroup);
getProductRoute.get(
  "/byCategories/:categoriesId",
  c.getProduct.getProductByCategoriesId
);

module.exports = getProductRoute;
