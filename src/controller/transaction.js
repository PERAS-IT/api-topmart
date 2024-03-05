const { CustomError } = require("../config/error");
const prisma = require("../config/prisma");
const repo = require("../repository");

// USER CREATE TRANSACTION
module.exports.createTransaction = async (req, res, next) => {
  try {
    // FIND transaction
    const transaction = await repo.transaction.getTransactionByUserId(
      req.user.id
    );
    if (transaction)
      throw new CustomError("user already has transaction", "WRONG_INPUT", 400);
    // CREATE transaction use $transaction
    await prisma.$transaction(async () => {
      req.body.userId = req.user.id;
      const newTransaction = await repo.transaction.createTransaction(req.body);
      // change cartItemId to arr [2,4]
      const itemId = req.cartItemId.split(",").map((el) => Number(el));
      // FIND cartItem data by cartItemId
      const itemData = await repo.cart.getCartItemByCartItemId(itemId);
      for (data of itemData) {
        data.transactionId = newTransaction.id;
      }
      // DELETE cartItem user choose from cart
      await repo.cart.deleteAllCartItemById(itemId);
      // CREATE itemPayment
      await repo.itemPayment.createItemPayment(itemData);
      // Find itemPayment by transactionId
      const itemPayment =
        await repo.itemPayment.getAllItemPaymentByTransactionId(
          newTransaction.id
        );
      // UPDATE stockQuantity
      const productUpdate = itemData.map(
        async (item) => await repo.itemPayment.deceaseStock(item)
      );
      await Promise.all(productUpdate);
      res.status(201).json({ transaction: newTransaction, itemPayment });
    });
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
