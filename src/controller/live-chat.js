module.exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const id = req.userId;
    //FIND HISTORY CONVERSATION

    res.status(200).json({ message: "sendMessage ready" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
