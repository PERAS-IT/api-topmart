const { CustomError } = require("../config/error");
const repo = require("../repository");

module.exports.sendMessage = async (req, res, next) => {
  console.log("first");
  try {
    const { message } = req.body;
    const id = req.user.id;
    //FIND HISTORY CONVERSATION
    // let conversation = await repo.liveChat.getHistoryChat(id);
    res.status(200).json({ message: "sendMessage ready" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
