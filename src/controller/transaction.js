const { TransactionStatus } = require("@prisma/client");
const { CustomError } = require("../config/error");
const repo = require("../repository");
const {
  createTransactionWithItemPayment,
} = require("../service/transaction/create-transaction");
const {
  canCelTransaction,
} = require("../service/transaction/cancel-transaction");
const {
  completeTransaction,
} = require("../service/transaction/complete-transaction");

// USER CREATE TRANSACTION
module.exports.createTransaction = async (req, res, next) => {
  try {
    //   // FIND transaction
    const transaction = await repo.transaction.getTransactionPendingByUserId(
      req.user.id
    );
    if (transaction)
      throw new CustomError("user already has transaction", "WRONG_INPUT", 400);
    // CHECK reward
    let point;
    if (req.body.reward) {
      const reward = await repo.reward.getReward(req.user.id);
      if (!reward)
        throw new CustomError("reward not found", "WRONG_INPUT", 400);
      if (reward.point < req.body.reward)
        throw new CustomError("invalid point input", "WRONG_INPUT", 400);
      point = reward.point - req.body.reward;
      delete req.body.reward;
    }
    // USE transaction for create
    const { newTransaction, itemPayment } =
      await createTransactionWithItemPayment(
        req.user.id,
        req.body,
        req.cartItemId,
        point
      );
    res.status(201).json({ transaction: newTransaction, itemPayment });
  } catch (err) {
    next(err);
  }
  return;
};

// USER UPDATE TRANSACTION
module.exports.updateTransaction = async (req, res, next) => {
  try {
    // FIND transaction
    const transaction = await repo.transaction.getTransactionPendingByUserId(
      req.user.id
    );
    if (!transaction)
      throw new CustomError("transaction not found", "WRONG_INPUT", 400);
    if (req.body.status === TransactionStatus.FAIL) {
      // STATUS fail
      const { newTransactionStatus } = canCelTransaction(req.transactionId);
      return res.status(200).json({ newTransactionStatus });
    } else if (req.body.status === TransactionStatus.COMPLETE) {
      // STATUS complete
      const { newTransactionStatus } = completeTransaction(req.transactionId);
      return res.status(200).json({ newTransactionStatus });
    } else throw new CustomError("invalid status", "WRONG_INPUT", 400);
  } catch (err) {
    next(err);
  }
  return;
};

// USER GET TRANSACTION
module.exports.getTransactionByUserId = async (req, res, next) => {
  try {
    const transaction = await repo.transaction.getAllTransactionByUserId(
      req.user.id
    );
    res.status(200).json({ transaction });
  } catch (err) {
    next(err);
  }
  return;
};

// for backend only use to test
module.exports.deleteTransaction = async (req, res, next) => {
  try {
    console.log(req.transactionId);
    await repo.transaction.deleteTransaction(req.transactionId);
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
  return;
};
