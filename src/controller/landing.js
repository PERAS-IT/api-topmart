const { CustomError } = require("../config/error");
const repo = require("../repository");
const utils = require("../utils");
const fs = require("fs/promises");

module.exports.uploadLanding = async (req, res, next) => {
  try {
    const landingPath = req.files.image1.map(async (image) =>
      utils.cloudinary.upload(image.path)
    );
    photoLinkLanding = await Promise.all(landingPath);
    // update link on table product image
    const updateLinkProduct = photoLinkLanding.map((link) => {
      const data = {
        image: link,
      };
      return repo.landing.createLandingPage(data);
    });
    photoProduct = await Promise.all(updateLinkProduct);

    res.status(201).json({ message: "create success" });
  } catch (err) {
    console.log(err);
  } finally {
    for (image of req.files.image) {
      fs.unlink(image.path);
    }
  }
};

module.exports.deleteLanding = async (req, res, next) => {
  const imageIdArr = req.body.imageDeleteArray;
  try {
    await repo.landing.deleteLandingPageById(imageIdArr);
    res.status(200).json({ message: "delete Landing success" });
  } catch (err) {
    console.log(err);
  }
};
