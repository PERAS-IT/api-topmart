const { CustomError } = require("../config/error");
const repo = require("../repository");
const utils = require("../utils");
const fs = require("fs/promises");

module.exports.getLanding = async (req, res, next) => {
  try {
    const resultLanding = await repo.landing.getAllLanding();
    res.status(200).json({ resultLanding });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.uploadLanding = async (req, res, next) => {
  try {
    const productId = +req.params.productId;
    if (!req.files) {
      throw new CustomError(
        "input landing image at least 1 image",
        "WRONG_INPUT",
        400
      );
    }
    const landingPath = req.files.image.map(async (image) =>
      utils.cloudinary.upload(image.path)
    );
    photoLinkLanding = await Promise.all(landingPath);
    // update link on table product image
    const updateLinkProduct = photoLinkLanding.map(async (link) => {
      const data = {
        image: link,
        productId: productId,
      };
      console.log(data);
      return await repo.landing.createLandingPage(data);
    });
    photoProduct = await Promise.all(updateLinkProduct);

    res.status(201).json({ message: "create success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    for (image of req.files.image) {
      fs.unlink(image.path);
    }
  }
};

module.exports.deleteLanding = async (req, res, next) => {
  try {
    const landingId = +req.params.landingId;
    const landingURL = await repo.landing.searchLanding(landingId);
    let publicId = landingURL.image.split("/")[7].split(".")[0];
    const promisesDeleteCloud = utils.cloudinary.delete(publicId);
    const promisesDeleteTable = repo.landing.deleteLandingById(landingId);
    await Promise.all([promisesDeleteCloud, promisesDeleteTable]).then(
      (values) => {
        console.log(values);
      }
    );
    res.status(200).json({ message: "delete Landing success" });
  } catch (err) {
    console.log(err);
  }
};

module.exports.deleteMultiLanding = async (req, res, next) => {
  const imageIdArr = req.body.imageDeleteArray;
  try {
    await repo.landing.deleteLandingPageById(imageIdArr);
    res.status(200).json({ message: "delete Landing success" });
  } catch (err) {
    console.log(err);
  }
};
