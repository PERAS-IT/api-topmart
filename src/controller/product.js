const { CustomError } = require("../config/error");
const repo = require("../repository");
const utils = require("../utils");
const fs = require("fs/promises");

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
    next(err);
  }
  return;
};

module.exports.createProductGroup = async (req, res, next) => {
  try {
    const { group, categories } = req.body;
    const searchCategories = await repo.product.findProductGroupByCategory(
      categories
    );
    if (searchCategories) {
      throw new CustomError("category had been to used", "WRONG_INPUT", 400);
    }
    const data = { group, categories };
    const response = await repo.product.createProductClass(data);
    res.status(200).json({ response });
  } catch (err) {
    next(err);
  }
};

module.exports.createProduct = async (req, res, next) => {
  console.log(req.files.imageProduct);
  try {
    const productData = req.body;
    console.log(productData);
    // const product = await repo.product.createProduct(productData);
    // let data = { productId: product.id };
    let productImages = [];
    let posterImages = [];

    // for (image of req.files.imageProduct) {
    //   data.image = await utils.cloudinary(image.path);
    //   const linkImage = await repo.product.createImageProduct(data);
    //   productImages.push(linkImage);
    // }
    // for(image of req.files.imagePoster){
    //   data.image = await utils.cloudinary(image.path);
    //   const linkImage = await repo.product.
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

module.exports.getAllProduct = async (req, res, next) => {
  try {
  } catch (err) {}
};
module.exports.getProductById = async (req, res, next) => {};
