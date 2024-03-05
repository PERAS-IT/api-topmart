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
    const searchSeries = await repo.product.findSeries(series);
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
    const data = req.body.series;
    const { series } = req.body;

    const searchSeries = await repo.product.findSeries(series);
    if (searchSeries) {
      throw new CustomError("series name had been used", "WRONG_INPUT", 400);
    }
    const result = await repo.product.editProductSeries(id, data);
    res.status(201).json({ result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//=======================================GROUP=======
//GET  GROUP

module.exports.getAllGroup = async (req, res, next) => {
  try {
    const getAllGroup = await repo.product.getAllGroup();
    res.status(200).json({ getAllGroup });
  } catch (err) {
    console.log(err);
  }
  return;
};

//CREATE GROUP
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

//EDIT  GROUP
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

    // // update table product
    const newProduct = await repo.product.createProduct(productData);

    // // upload cloudinary

    // /***cover*****/
    const coverLocalPath = req.files.coverProduct[0].path;
    const coverPath = await utils.cloudinary.upload(coverLocalPath);
    await repo.product.createCover(newProduct.id, coverPath);

    // /**product */
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

    //upload cloudinary
    let posterPath = [];
    for (let i = 1; i <= 5; i++) {
      posterPath.push(req.files[`poster${i}`][0].path);
    }

    const linkAllPoster = await Promise.all(
      posterPath.map((path) => utils.cloudinary.upload(path))
    );

    const data = {};
    data.productId = newProduct.id;
    for (let i = 0; i < linkAllPoster.length; i++) {
      data[`posters${i + 1}`] = linkAllPoster[i];
    }

    await repo.product.createPoster(data);

    res.status(201).json({ message: "create success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    for (image of req.files.imageProduct) {
      fs.unlink(image.path);
    }
    fs.unlink(req.files.coverProduct[0].path);
    for (let i = 1; i <= 5; i++) {
      fs.unlink(req.files[`poster${i}`][0].path);
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

//=======================================Cover=====
//DELETE COVER BY ID
module.exports.deleteCover = async (req, res, next) => {
  try {
    const coverId = +req.params.coverId;
    const coverURL = await repo.product.searchCoverByCoverId(coverId);

    let publicId = coverURL.images.split("/")[7].split(".")[0];
    console.log(publicId);
    const promisesDeleteCloud = utils.cloudinary.delete(publicId);
    const promisesDeleteTable = repo.product.deleteCover(coverId);
    await Promise.all([promisesDeleteCloud, promisesDeleteTable]).then(
      (values) => {
        console.log(values);
      }
    );
    res.status(200).json({ message: "delete Cover Success" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.updateCover = async (req, res, next) => {
  try {
    const coverId = +req.params.coverId;
    const coverURL = await repo.product.searchCoverByCoverId(coverId);

    let publicId = coverURL.images.split("/")[7].split(".")[0];
    console.log(publicId);
    const promisesDeleteCloud = utils.cloudinary.delete(publicId);
    const promisesUpdateCloud = await utils.cloudinary.upload(req.file.path);
    const promisesUpdateTable = repo.product.updateCover(
      coverId,
      promisesUpdateCloud
    );
    await Promise.all([promisesDeleteCloud, promisesUpdateTable]).then(
      (values) => {
        console.log(values);
      }
    );
    res.status(200).json({ message: "update Cover Success" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//================================IMAGE PRODUCT=====
// DELETE IMAGE BY IMAGE ID
module.exports.deleteImage = async (req, res, next) => {
  try {
    const imageId = +req.params.imageId;
    const imageURL = await repo.product.searchImageByImageId(imageId);

    let publicId = imageURL.images.split("/")[7].split(".")[0];
    console.log(publicId);
    const promisesDeleteCloud = utils.cloudinary.delete(publicId);
    const promisesDeleteTable = repo.product.deleteProductImageById(imageId);
    await Promise.all([promisesDeleteCloud, promisesDeleteTable]).then(
      (values) => {
        console.log(values);
      }
    );
    res.status(200).json({ message: "deleteImage Success" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//================================POSTER PRODUCT=====
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

//DELETE POSTER BY POSTER1 BY ID

//DELETE POSTER BY POSTER2 BY ID

//DELETE POSTER BY POSTER3 BY ID

//DELETE POSTER BY POSTER4 BY ID

//DELETE POSTER BY POSTER5 BY ID

//GET ALL PRODUCT =====> render Card
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
