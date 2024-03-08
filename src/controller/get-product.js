const { CustomError } = require("../config/error");
const repo = require("../repository");

module.exports.getProductBySeriesId = async (req, res, next) => {
  try {
    const id = +req.params.seriesId;
    const resultBySeriesId = await repo.getProduct.getProductBySeriesId(id);
    res.status(200).json({ resultBySeriesId });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.getProductByGroup = async (req, res, next) => {
  try {
    const groupName = req.params.groupName;
    console.log(groupName);
    const resultByGroup = await repo.getProduct.getProductByGroupName(
      groupName
    );
    res.status(200).json({ resultByGroup });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.getProductByCategoriesId = async (req, res, next) => {
  try {
    const categoriesId = +req.params.categoriesId;
    const resultByCategories = await repo.getProduct.getProductByCategoriesId(
      categoriesId
    );
    res.status(200).json({ resultByCategories });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
