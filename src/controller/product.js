const repo = require("../repository");

module.exports.createProductSeries = async (req, res, next) => {
  try {
    const serie = req.body;
    console.log(serie);
    const resultSerie = await repo.product.createProductSeries(serie);
    res.status(200).json({ resultSerie });
  } catch (err) {
    next(err);
  }
  return;
};

module.exports.createProductClass = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await repo.product.createProductClass(data);
    res.status(200).json({ response });
  } catch (err) {
    next(err);
  }
};

module.exports.createProduct = async (req, res, next) => {
  try {
    const { data } = req.body;
    // const response = await repo.product.createProduct(data);
    let productImages = [];
    let posterImages = [];
    let productImagesLink = [];
    let posterImagesLink = [];

    res.status(200).json({ response });
  } catch (err) {
    next(err);
  }
};

module.exports.getProductById = async (req, res, next) => {};
