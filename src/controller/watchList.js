const { CustomError } = require("../config/error");
const repo = require("../repository");

// GET WATCH LIST
module.exports.getWatchList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resultWatchList = await repo.watchList.getWatchList(userId);
    res.status(200).json({ resultWatchList });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// CREATE WATCH LIST

module.exports.createWatchList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = +req.params.productId;
    const searchCheck = await repo.watchList.searchDuplicate(userId, productId);
    if (searchCheck) {
      throw new CustomError("Has been have watch List", "WRONG_INPUT", 400);
    }
    await repo.watchList.createWatchList(userId, productId);
    res.status(200).json({ message: "create watch list success" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// DELETE  WATCH LIST
module.exports.deleteWatchList = async (req, res, next) => {
  try {
    const watchListId = +req.params.watchListId;
    await repo.watchList.deleteWatchList(watchListId);
    res.status(200).json({ message: "delete watch list success" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
