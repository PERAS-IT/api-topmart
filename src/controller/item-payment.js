const repo = require("../repository");

module.exports.deleteItemPayment = async (req, res, next) => {
  await repo.itemPayment.deleteItemPayment(req.itemPaymentId);
  res.status(204).json({});
};
module.exports.getItemPaymentByTransactionId = async (req, res, next) => {
  const itemPayment = await repo.itemPayment.getAllItemPaymentByTransactionId(
    req.transactionId
  );
  res.status(200).json({ itemPayment });
};
