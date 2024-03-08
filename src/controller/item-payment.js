const { CustomError } = require("../config/error");
const repo = require("../repository");

// for backend only
module.exports.deleteItemPayment = async (req, res, next) => {
  try {
    const itemPayment = await repo.itemPayment.getItemPaymentById(
      req.itemPaymentId
    );
    if (!itemPayment)
      throw new CustomError("itemPayment not found", "WRONG_INPUT", 400);
    await repo.itemPayment.deleteItemPayment(req.itemPaymentId);
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
  return;
};
// get itemPayment by transactionId
module.exports.getItemPaymentByTransactionId = async (req, res, next) => {
  try {
    const itemPayment = await repo.itemPayment.getAllItemPaymentByTransactionId(
      req.transactionId
    );
    res.status(200).json({ itemPayment });
  } catch (err) {
    next(err);
  }
  return;
};
