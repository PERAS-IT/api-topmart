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

    const resultSeries = await repo.product.createProductSeries(req.body);
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
    productData.serieId = +req.body.serieId;
    productData.groupId = +req.body.groupId;
    productData.price = +req.body.price;
    productData.stockQuantity = +req.body.stockQuantity;
    productData.launchDate = new Date(req.body.launchDate); // select date from front

    let photoProduct = [];
    let photoLinkProduct = [];

    // // update table product

    const newProduct = await repo.product.createProduct(productData);

    // // upload cloudinary

    // /***cover*****/
    if (req.files.coverProduct) {
      const coverLocalPath = req.files.coverProduct[0].path;
      const coverPath = await utils.cloudinary.upload(coverLocalPath);
      await repo.product.createCover(newProduct.id, coverPath);
    }

    // /**product */
    if (req.files.imageProduct) {
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
    }

    // update poster

    //upload cloudinary
    let posterPath = [];
    for (let i = 1; i <= 5; i++) {
      if (req.files[`poster${i}`]) {
        posterPath.push(req.files[`poster${i}`][0].path);
      } else {
        posterPath.push(null);
      }
    }

    const linkAllPoster = await Promise.all(
      posterPath.map((path) =>
        path === null ? null : utils.cloudinary.upload(path)
      )
    );

    const data = {};
    data.productId = newProduct.id;
    for (let i = 0; i <= 4; i++) {
      if (linkAllPoster[i]) {
        data[`posters${i + 1}`] = linkAllPoster[i];
      } else {
        data[`posters${i + 1}`] = null;
      }
    }

    await repo.product.createPoster(data);

    res.status(201).json({ message: "create success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    if (req.files.imageProduct) {
      for (image of req.files.imageProduct) {
        fs.unlink(image.path);
      }
    }
    if (req.files.coverProduct) {
      fs.unlink(req.files.coverProduct[0].path);
    }
    for (let i = 1; i <= 5; i++) {
      if (req.files[`poster${i}`]) {
        fs.unlink(req.files[`poster${i}`][0]?.path);
      }
    }
  }
};

// EDIT PRODUCT
module.exports.editProduct = async (req, res, next) => {
  try {
    const productId = +req.params.productId;
    const { productName } = req.body;
    const searchNameDuplicate = await repo.product.findProductDuplicate(
      productName
    );
    if (searchNameDuplicate.length > 1) {
      throw new CustomError("Product name is duplicate", "WRONG_INPUT", 400);
    }

    const data = req.body;
    const updateResult = await repo.product.editProduct(productId, data);
    res.status(200).json({ updateResult });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// UPDATE QUANTITY
module.exports.updateQuantity = async (req, res, next) => {
  try {
    const productId = +req.param.productId;
    const quantity = req.body.stockQuantity;
    const resultUpdateQuantity = await repo.product.updateQuantity(
      productId,
      quantity
    );
    res.status(200).json({ resultUpdateQuantity });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
// SOFT DELETE
module.exports.deleteSoft = async (req, res, next) => {
  try {
    const productId = +req.params.productId;
    await repo.product.deleteProductSoft(productId);
    res.status(200).json({ message: "inactive product success" });
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
//UPDATE COVER
module.exports.updateCover = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError("input file cover image", WRONG_INPUT, 400);
    }
    const coverId = +req.params.coverId;
    const coverURL = await repo.product.searchCoverByCoverId(coverId);

    let publicId = coverURL.cover.split("/")[7].split(".")[0];
    await utils.cloudinary.delete(publicId);

    const updateCloudURL = await utils.cloudinary.upload(req.file.path);

    await repo.product.updateCover(coverId, updateCloudURL);
    res.status(200).json({ message: "update Cover Success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    if (req.file) fs.unlink(req.file.path);
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
module.exports.addImage = async (req, res, next) => {
  console.log(req.files);
  try {
    if (!req.file) {
      throw new CustomError("input file image", WRONG_INPUT, 400);
    }
    const pathURL = await utils.cloudinary.upload(req.file.path);
    const data = {};
    data.productId = +req.params.productId;
    data.images = pathURL;
    await repo.product.createImageProduct(data);

    res.status(200).json({ message: "add image Success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    fs.unlink(req.file.path);
  }
};
module.exports.updateImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError("input file cover image", WRONG_INPUT, 400);
    }
    const imageId = +req.params.imageId;
    const imageURL = await repo.product.searchImageByImageId(imageId);

    let publicId = imageURL.images.split("/")[7].split(".")[0];
    console.log(publicId);
    //DELETE CLOUDE
    await utils.cloudinary.delete(publicId);
    //UPDATE CLOUDE
    const updateCloudURL = await utils.cloudinary.upload(req.file.path);
    //UPDATE TABLE
    await repo.product.updateImageProduct(imageId, updateCloudURL);
    res.status(200).json({ message: "update image Success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    fs.unlink(req.file.path);
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

//DELETE  POSTER1 BY ID
module.exports.deletePoster1 = async (req, res, next) => {
  try {
    const posterId = +req.params.posterId;
    const posterURL = await repo.product.searchPoster1ByPosterId(posterId);
    console.log(posterURL);
    let publicId = posterURL.posters1.split("/")[7].split(".")[0];

    const promisesDeleteCloud = utils.cloudinary.delete(publicId);
    const promisesDeleteTable = repo.product.deletePoster1ByPosterId(posterId);
    await Promise.all([promisesDeleteCloud, promisesDeleteTable]);
    res.status(200).json({ message: "delete poster 1 success" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//DELETE  POSTER2 BY ID
module.exports.deletePoster2 = async (req, res, next) => {
  try {
    const posterId = +req.params.posterId;
    const posterURL = await repo.product.searchPoster2ByPosterId(posterId);
    let publicId = posterURL.posters2.split("/")[7].split(".")[0];

    const promisesDeleteCloud = utils.cloudinary.delete(publicId);
    const promisesDeleteTable = repo.product.deletePoster2ByPosterId(posterId);
    await Promise.all([promisesDeleteCloud, promisesDeleteTable]);
    res.status(200).json({ message: "delete poster 2 success" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//DELETE  POSTER3 BY ID
module.exports.deletePoster3 = async (req, res, next) => {
  try {
    const posterId = +req.params.posterId;
    const posterURL = await repo.product.searchPoster3ByPosterId(posterId);
    let publicId = posterURL.posters3.split("/")[7].split(".")[0];

    const promisesDeleteCloud = utils.cloudinary.delete(publicId);
    const promisesDeleteTable = repo.product.deletePoster3ByPosterId(posterId);
    await Promise.all([promisesDeleteCloud, promisesDeleteTable]);
    res.status(200).json({ message: "delete poster 3 success" });
  } catch (err) {
    console.log(err);
  }
};
//DELETE  POSTER4 BY ID
module.exports.deletePoster4 = async (req, res, next) => {
  try {
    const posterId = +req.params.posterId;
    const posterURL = await repo.product.searchPoster4ByPosterId(posterId);
    let publicId = posterURL.posters4.split("/")[7].split(".")[0];

    const promisesDeleteCloud = utils.cloudinary.delete(publicId);
    const promisesDeleteTable = repo.product.deletePoster4ByPosterId(posterId);
    await Promise.all([promisesDeleteCloud, promisesDeleteTable]);
    res.status(200).json({ message: "delete poster 4 success" });
  } catch (err) {
    console.log(err);
  }
};
//DELETE  POSTER5 BY ID
module.exports.deletePoster5 = async (req, res, next) => {
  try {
    const posterId = +req.params.posterId;
    const posterURL = await repo.product.searchPoster5ByPosterId(posterId);
    let publicId = posterURL.posters5.split("/")[7].split(".")[0];

    const promisesDeleteCloud = utils.cloudinary.delete(publicId);
    const promisesDeleteTable = repo.product.deletePoster5ByPosterId(posterId);
    await Promise.all([promisesDeleteCloud, promisesDeleteTable]);
    res.status(200).json({ message: "delete poster 5 success" });
  } catch (err) {
    console.log(err);
  }
};
//UPDATE  POSTER1 BY ID
module.exports.updatePoster1 = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError("input file image", WRONG_INPUT, 400);
    }
    const posterId = +req.params.posterId;

    const posterURL = await repo.product.searchPoster1ByPosterId(posterId);
    //CHECK CLOUD AND DELETE ON CLOUD
    if (posterURL.posters1) {
      let publicId = posterURL.posters1.split("/")[7].split(".")[0];
      await utils.cloudinary.delete(publicId);
    }
    const updateCloudURL = await utils.cloudinary.upload(req.file.path);
    await repo.product.updatePoster1ByPostId(posterId, updateCloudURL);
    res.status(200).json({ message: "update poster1 Success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    fs.unlink(req.file.path);
  }
};
//UPDATE  POSTER2 BY ID
module.exports.updatePoster2 = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError("input file image", WRONG_INPUT, 400);
    }
    const posterId = +req.params.posterId;
    const posterURL = await repo.product.searchPoster2ByPosterId(posterId);
    //CHECK CLOUD AND DELETE ON CLOUD
    if (posterURL.posters2) {
      let publicId = posterURL.posters2.split("/")[7].split(".")[0];
      await utils.cloudinary.delete(publicId);
    }
    const updateCloudURL = await utils.cloudinary.upload(req.file.path);
    await repo.product.updatePoster2ByPostId(posterId, updateCloudURL);
    res.status(200).json({ message: "update poster2 Success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    fs.unlink(req.file.path);
  }
};
//UPDATE  POSTER3 BY ID
module.exports.updatePoster3 = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError("input file image", WRONG_INPUT, 400);
    }
    const posterId = +req.params.posterId;
    const posterURL = await repo.product.searchPoster3ByPosterId(posterId);
    //CHECK CLOUD AND DELETE ON CLOUD
    if (posterURL.posters3) {
      let publicId = posterURL.posters3.split("/")[7].split(".")[0];
      await utils.cloudinary.delete(publicId);
    }
    const updateCloudURL = await utils.cloudinary.upload(req.file.path);
    await repo.product.updatePoster3ByPostId(posterId, updateCloudURL);
    res.status(200).json({ message: "update poster3 Success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    fs.unlink(req.file.path);
  }
};
//UPDATE  POSTER4 BY ID
module.exports.updatePoster4 = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError("input file image", WRONG_INPUT, 400);
    }
    const posterId = +req.params.posterId;
    const posterURL = await repo.product.searchPoster4ByPosterId(posterId);
    //CHECK CLOUD AND DELETE ON CLOUD
    if (posterURL.posters4) {
      let publicId = posterURL.posters4.split("/")[7].split(".")[0];
      await utils.cloudinary.delete(publicId);
    }
    const updateCloudURL = await utils.cloudinary.upload(req.file.path);
    await repo.product.updatePoster4ByPostId(posterId, updateCloudURL);
    res.status(200).json({ message: "update poster4 Success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    fs.unlink(req.file.path);
  }
};
//UPDATE  POSTER5 BY ID
module.exports.updatePoster5 = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError("input file image", WRONG_INPUT, 400);
    }
    const posterId = +req.params.posterId;
    const posterURL = await repo.product.searchPoster5ByPosterId(posterId);
    //CHECK CLOUD AND DELETE ON CLOUD
    if (posterURL.posters5) {
      let publicId = posterURL.posters5.split("/")[7].split(".")[0];
      await utils.cloudinary.delete(publicId);
    }
    const updateCloudURL = await utils.cloudinary.upload(req.file.path);
    await repo.product.updatePoster5ByPostId(posterId, updateCloudURL);
    res.status(200).json({ message: "update poster5 Success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    fs.unlink(req.file.path);
  }
};

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
