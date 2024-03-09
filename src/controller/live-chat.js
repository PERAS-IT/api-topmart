const { CustomError } = require("../config/error");
const { userId } = require("../middlewares/validators");
const repo = require("../repository");

module.exports.getMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    //FIND HISTORY CONVERSATION
    const conversation = await repo.liveChat.getHistoryChat(userId);
    res.status(200).json({ conversation });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal server error" });
  }
};

module.exports.getMessageForAdmin = async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    const conversation = await repo.liveChat.getHistoryChat(userId);
    res.status(200).json({ conversation });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal server error" });
  }
};

module.exports.getUserForSidebar = async (req, res, next) => {};
