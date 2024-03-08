const { CustomError } = require("../config/error");
const repo = require("../repository");

// GET REWARD USER
module.exports.getRewardUser = async (req, res, next) => {
  try {
    const reward = await repo.reward.getReward(req.user.id);
    console.log(reward);
    res.status(200).json({ reward });
  } catch (err) {
    next(err);
  }
  return;
};

// UPDATE POINT REWARD
module.exports.updateRewardUser = async (req, res, next) => {
  try {
    const userReward = await repo.reward.getReward(req.user.id);
    if (!userReward)
      throw new CustomError("user reward not found", "WRONG_INPUT", 400);
    const reward = await repo.reward.updateReward(req.body, req.user.id);
    res.status(200).json({ reward });
  } catch (err) {
    next(err);
  }
  return;
};
