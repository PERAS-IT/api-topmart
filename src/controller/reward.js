const { CustomError } = require("../config/error");
const repo = require("../repository");

module.exports.getRewardUser = async (req, res, next) => {
  try {
    const reward = repo.reward.getReward(req.user.id);
    res.status(200).json({ reward });
  } catch (err) {
    next(err);
  }
  return;
};
module.exports.updateRewardUser = async (req, res, next) => {
  try {
    const userReward = repo.reward.getReward(req.user.id);
    if (!userReward)
      throw new CustomError("user reward not found", "WRONG_INPUT", 400);
    const reward = repo.reward.updateReward(req.body, req.user.id);
    res.status(200).json({ reward });
  } catch (err) {
    next(err);
  }
  return;
};
