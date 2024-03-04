const { CustomError } = require("../config/error");
const repo = require("../repository");

// USER CREATE TRANSACTION
module.exports.createTransaction = async (req, res, next) => {
  try {
    console.log(req.params);
    const transaction = await repo.transaction.getTransactionByUserId(
      req.user.id
    );
    if (transaction)
      throw new CustomError("user already has transaction", "WRONG_INPUT", 400);
    req.body.userId = req.user.id;
    console.log(req.productId);
    const newTransaction = await repo.transaction.createTransaction(req.body);
    const itemId = req.productId.split(",").map((el) => Number(el));
    const itemData = await repo.cart.getCartItemByCartItemId(itemId);
    for (data of itemData) {
      data.transactionId = newTransaction.id;
    }
    console.log(itemData);
    console.log(itemId);
    await repo.cart.deleteAllCartItemById(itemId);
    const itemPayment = await repo.itemPayment.createItemPayment(itemData);
    res.status(201).json({ transaction: newTransaction, itemPayment });
  } catch (err) {
    next(err);
  }
  return;
};
// USER UPDATE TRANSACTION
module.exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await repo.transaction.getTransactionByUserId(
      req.user.id
    );
    if (!transaction)
      throw new CustomError("transaction not found", "WRONG_INPUT", 400);
    const newStatus = await repo.transaction.updateTransaction(
      req.body,
      req.user.id
    );
    res.status(200).json({ transaction: newStatus });
  } catch (err) {
    next(err);
  }
  return;
};

module.exports.deleteTransaction = async (req, res, next) => {
  console.log(req.transactionId);
  await repo.transaction.deleteTransaction(req.transactionId);
  res.status(204).json({});
};
