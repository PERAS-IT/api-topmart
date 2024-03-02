const { link } = require("joi");
const { CustomError } = require("../config/error");
const repo = require("../repository");
const utils = require("../utils");
const fs = require("fs/promises");

//GET PRODUCT GROUP

module.exports.getAllGroup = async (req, res, next) => {
  try {
    const getAllGroup = await repo.product.getAllGroup();
    res.status(200).json({ getAllGroup });
  } catch (err) {
    console.log(err);
  }
  return;
};

// GET ALL SERIES
module.exports.getAllSeries = async (req, res, next) => {
  try {
    const result = await repo.product.getAllSeries();
    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

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
  try {
    const productData = req.body;
    // for post man
    productData.serieId = +req.body.serieId;
    productData.groupId = +req.body.groupId;
    productData.price = +req.body.price;
    productData.stockQuantity = +req.body.stockQuantity;
    productData.launchDate = new Date();

    let photoProduct = [];
    let photoLinkProduct = [];
    // update table product
    const newProduct = await repo.product.createProduct(productData);

    // upload cloudinary
    const productPath = req.files.imageProduct.map(
      async (image) => await utils.cloudinary.upload(image.path)
    );
    photoLinkProduct = await Promise.all(productPath);
    // update link on table product image
    const updateLinkProduct = photoLinkProduct.map((link) => {
      const data = {
        productId: newProduct.id,
        images: link,
      };
      return repo.product.createImageProduct(data);
    });
    photoProduct = await Promise.all(updateLinkProduct);

    // update poster
    let photoPoster = [];
    let photoLinkPoster = [];

    //upload cloudinary
    const posterPath = req.files.imagePoster.map(
      async (image) => await utils.cloudinary.upload(image.path)
    );
    photoLinkPoster = await Promise.all(posterPath);

    //upload update Table
    const updateLinkPoster = photoLinkPoster.map((link) => {
      const data = {
        productId: newProduct.id,
        posters: link,
      };
      return repo.product.createImagePoster(data);
    });

    photoPoster = await Promise.all(updateLinkPoster);

    res.status(201).json({ message: "create success" }); // return ???
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
  console.log(req);
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
