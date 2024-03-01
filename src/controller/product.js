const { CustomError } = require("../config/error");
const repo = require("../repository");
const utils = require("../utils");
const fs = require("fs/promises");
//CREATE PRODUCT SERIES
module.exports.createProductSeries = async (req, res, next) => {
  try {
    const { series } = req.body;
    const searchSeries = await repo.product.findSeries({ series });
    if (searchSeries) {
      throw new CustomError("series name had been used", "WRONG_INPUT", 400);
    }

    const resultSeries = await repo.product.createProductSeries(series);
    res.status(200).json({ resultSeries });
  } catch (err) {
    console.log(err);
    next(err);
  }
  return;
};
//EDIT PRODUCT SERIES
module.exports.editProductSeries = async (req, res, next) => {
  try {
    const id = +req.params.seriesId;
    const data = req.body;

    const result = await repo.product.editProductSeries(id, data);
    res.status(201).json({ result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//CREATE PRODUCT GROUP
module.exports.createProductGroup = async (req, res, next) => {
  try {
    const { categories } = req.body;
    const searchCategories = await repo.product.findProductGroupByCategory(
      categories
    );

    if (searchCategories) {
      throw new CustomError("category had been to used", "WRONG_INPUT", 400);
    }
    const data = req.body;
    console.log(data);
    const response = await repo.product.createProductClass(data);
    res.status(200).json({ response });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//CREATE PRODUCT
module.exports.createProduct = async (req, res, next) => {
  // console.log(req.files.imageProduct);
  try {
    const productData = req.body;
    console.log(productData);
    // let data = { productId: product.id };
    let productImages = [];
    let posterImages = [];

    // const product = await repo.product.createProduct(productData);
    // for (image of req.files.imageProduct) {
    //   data.image = await utils.cloudinary(image.path);
    //   const linkProductImage = await repo.product.createImageProduct(data);
    //   productImages.push(linkProductImage);
    // }
    // for (image of req.files.imagePoster) {
    //   data.image = await utils.cloudinary(image.path);
    //   const linkPosterImage = await repo.product.createImagePoster(date);
    //   posterImages.push(linkPosterImage);
    // }

    res.status(201).json({ message: "create success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    for (image of req.files.imageProduct) {
      fs.unlink(image.path);
    }
    for (image of req.files.imagePoster) {
      fs.unlink(image.path);
    }
  }
};

//GET ALL PRODUCT
module.exports.getAllProduct = async (req, res, next) => {
  try {
    const resultAllProduct = await repo.product.getAllProduct();
    res.status(200).json({ resultAllProduct });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//GET PRODUCT BY PRODUCT SERIES
module.exports.getProductByIdSeries = async (req, res, next) => {};
//GET PRODUCT BY GROUP
module.exports.getProductByIdGroup = async (req, res, next) => {};
//GET PRODUCT BY ID
module.exports.getProductById = async (req, res, next) => {};
