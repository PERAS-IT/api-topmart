const { CustomError } = require("../config/error");
const repo = require("../repository");

module.exports.getNewArrivalProduct = async (req, res, next) => {
  try {
    const resultNewArrival = await repo.statusProduct.getNewArrival();
    res.status(200).json({ resultNewArrival });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.getLaunchCalenderProduct = async (req, res, next) => {
  try {
    const resultLaunchProduct =
      await repo.statusProduct.getLaunchProductSortByDate();
    res.status(200).json({ resultLaunchProduct });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
