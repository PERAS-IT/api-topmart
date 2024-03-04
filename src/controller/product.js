const { link } = require("joi");
const { CustomError } = require("../config/error");
const repo = require("../repository");
const utils = require("../utils");
const fs = require("fs/promises");

//=======================================SERIES======
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
//=======================================GROUP=======
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

//CREATE PRODUCT GROUP
module.exports.createProductGroup = async (req, res, next) => {
  try {
    const { categories } = req.body;
    const searchCategories = await repo.product.findGroupByCategory(categories);

    if (searchCategories) {
      throw new CustomError("category had been to used", "WRONG_INPUT", 400);
    }
    const data = req.body;
    console.log(data);
    const response = await repo.product.createProductGroup(data);
    res.status(200).json({ response });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//EDIT PRODUCT GROUP
module.exports.editGroup = async (req, res, next) => {
  try {
    const groupId = +req.params.groupId;
    const { categories } = req.body;
    const searchCategories = await repo.product.findGroupByCategory(categories);
    console.log(searchCategories);
    if (searchCategories) {
      throw new CustomError("category had been to used", "WRONG_INPUT", 400);
    }
    const data = req.body;
    console.log(data);
    const response = await repo.product.editProductGroup(groupId, data);
    res.status(200).json({ message: "ok" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//=======================================PRODUCT=====
//CREATE PRODUCT
module.exports.createProduct = async (req, res, next) => {
  try {
    const { productName } = req.body;
    const searchProduct = await repo.product.findProductByName(productName);

    if (searchProduct) {
      throw new CustomError("name has been exist", "WRONG_INPUT", 400);
    }
    const productData = req.body;
    // for post man
    productData.serieId = +req.body.serieId;
    productData.groupId = +req.body.groupId;
    productData.price = +req.body.price;
    productData.stockQuantity = +req.body.stockQuantity;
    productData.launchDate = new Date(); // select date from front

    let photoProduct = [];
    let photoLinkProduct = [];

    // update table product
    const newProduct = await repo.product.createProduct(productData);

    // upload cloudinary

    /***cover*****/
    const coverLocalPath = req.files.cover.path;
    const coverPath = await utils.cloudinary.upload(coverLocalPath);
    await repo.product.createCover(coverPath);

    /**product */
    const productPath = req.files.imageProduct.map(async (image) =>
      utils.cloudinary.upload(image.path)
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
    /*poster separate Path */
    const posterLocalPath1 = req.files.poster1.path;
    const posterLocalPath2 = req.files.poster2.path;
    const posterLocalPath3 = req.files.poster3.path;
    const posterLocalPath4 = req.files.poster4.path;
    const posterLocalPath5 = req.files.poster5.path;

    const posterPath1 = utils.cloudinary(posterLocalPath1);
    const posterPath2 = utils.cloudinary(posterLocalPath2);
    const posterPath3 = utils.cloudinary(posterLocalPath3);
    const posterPath4 = utils.cloudinary(posterLocalPath4);
    const posterPath5 = utils.cloudinary(posterLocalPath5);
    await Promise.all([
      posterPath1,
      posterPath2,
      posterPath3,
      posterPath4,
      posterPath5,
    ]);
    const data = {};
    data.poster1 = posterPath1;
    data.poster2 = posterPath2;
    data.poster3 = posterPath3;
    data.poster4 = posterPath4;
    data.poster5 = posterPath5;
    await repo.product.createPoster(data);

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
// EDIT PRODUCT
module.exports.editProduct = async (req, res, next) => {
  try {
    const prodId = +req.params;
    const { productName } = req.body;
    const searchNameDuplicate = await repo.product.findProductDuplicate(
      productName
    );
    if (searchNameDuplicate.length > 1) {
      throw new CustomError("Product name is duplicate", "WRONG_INPUT", 400);
    }
    const data = req.body;
    const updateResult = await repo.product.editProduct(prodId, data);
    res.status(200).json({ updateResult });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
// DELETE PRODUCT
module.exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = +req.params.productId;
    await repo.product.deleteProductSoft(productId);
    // delete image
    const resultSearch = await repo.product.searchImagesByProductId(productId);
    // delete on cloudinary
    if (resultSearch.length > 1) {
      const promisesDeleteCloud = resultSearch.map(async (imageURL) => {
        let publicId = imageURL.images.split("/")[7].split(".")[0];
        await utils.cloudinary.delete(publicId);
        // delete on table
        const promisesDeleteTable = await repo.product.deleteImageByProductId(
          productId
        );
        Promise.all([promisesDeleteCloud, promisesDeleteTable]).then((value) =>
          console.log(value)
        );
      });
    }
    // delete poster
    const resultSearchPoster = await repo.product.searchPosterByProductId(
      productId
    );
    if (resultSearchPoster.length > 1) {
      const promisesDeleteCloud = resultSearchPoster.map(async (imageURL) => {
        console.log(imageURL.posters);
        let publicId = imageURL.posters.split("/")[7].split(".")[0];
        await utils.cloudinary.delete(publicId);
        // delete on table
        const promisesDeleteTable = await repo.product.deletePosterByProductId(
          productId
        );
        Promise.all([promisesDeleteCloud, promisesDeleteTable]).then((value) =>
          console.log(value)
        );
      });
    }
    const checkImage = await repo.product.searchPosterByProductId(productId);
    const checkPoster = await repo.product.searchPosterByProductId(productId);
    if (checkImage.length < 1 && checkPoster.length < 1) {
      await repo.product.deleteProduct(productId);
    }

    res.status(200).json({ message: "In Active success" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// DELETE IMAGE BY IMAGE ID
module.exports.deleteImage = async (req, res, next) => {
  try {
    const imageId = +req.params.imageId;
    const imageURL = await repo.product.searchImageByImageId(imageId);

    let publicId = imageURL.images.split("/")[7].split(".")[0];
    console.log(publicId);
    const promisesDeleteCloud = await utils.cloudinary.delete(publicId);
    const promisesDeleteTable = await repo.product.deleteProductImageById(
      imageId
    );
    Promise.all([promisesDeleteCloud, promisesDeleteTable]).then((values) => {
      console.log(values);
    });
    res.status(200).json({ message: "deleteImage Success" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//DELETE POSTER BY POSTER ID
module.exports.deletePoster = async (req, res, next) => {
  try {
    const imageId = +req.params.imageId;
    const imageURL = await repo.product.searchImageByImageId(imageId);

    let publicId = imageURL.images.split("/")[7].split(".")[0];
    console.log(publicId);
    const promisesDeleteCloud = await utils.cloudinary.delete(publicId);
    const promisesDeleteTable = await repo.product.deletePosterByPosterId(
      imageId
    );
    Promise.all([promisesDeleteCloud, promisesDeleteTable]).then((values) => {
      console.log(values);
    });
    res.status(200).json({ message: "deleteImage Success" });
  } catch (err) {
    console.log(err);
    next(err);
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
//GET PRODUCT BY ID
module.exports.getProductById = async (req, res, next) => {
  try {
    const productId = +req.params.productId;
    const resultProductById = await repo.product.getProductById(productId);
    res.status(200).json({ resultProductById });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//GET PRODUCT BY PRODUCT SERIES
module.exports.getProductByIdSeries = async (req, res, next) => {
  try {
    const serieId = +req.params.productId;
    const resultProductById = await repo.product.findSeries(serieId);
    res.status(200).json({ resultProductById });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//GET PRODUCT BY GROUP
module.exports.getProductByIdGroup = async (req, res, next) => {};
