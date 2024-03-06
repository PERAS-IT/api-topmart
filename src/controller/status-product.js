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
