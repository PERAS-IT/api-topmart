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
const { sendEmail } = require("../utils/send-mail");
const stripe = require("../utils/stripe");

// USER CREATE TRANSACTION
module.exports.createTransaction = async (req, res, next) => {
  try {
    // FIND transaction
    const cartItemId = req.body.cartItemId;
    console.log(cartItemId);
    delete req.body.cartItemId;
    const cartItemActive = await repo.cart.getCartItemByCartItemId(cartItemId);
    if (cartItemId.length != cartItemActive.length)
      throw new CustomError("invalid product included", "WRONG_INPUT", 400);
    let point;
    if (req.body.reward >= 0 || req.body.discount >= 0) {
      const reward = await repo.reward.getReward(req.user.id);
      if (!reward)
        throw new CustomError("reward not found", "WRONG_INPUT", 400);
      if (reward.point < req.body.reward)
        throw new CustomError("invalid point input", "WRONG_INPUT", 400);
      if (req.body.discount && !req.body.reward)
        throw new CustomError("not found discount to use", "WRONG_INPUT", 400);
      point = reward.point - req.body.reward;
      delete req.body.reward;
    }
    // USE transaction for create
    const { newTransaction, itemPayment } =
      await createTransactionWithItemPayment(
        req.user.id,
        req.body,
        cartItemId,
        point
      );
    let line_item = [];
    const discount = newTransaction.discount || 0;
    if (discount != req.body.discount)
      throw new CustomError("discount not match", "WRONG_INPUT", 400);
    if (req.body.totalAmount != newTransaction.totalAmount)
      throw new CustomError("totalAmount not match", "WRONG_INPUT", 400);
    for (item of itemPayment) {
      const product = await repo.product.getProductById(item.productId);
      line_item.push({
        price_data: {
          currency: "thb",
          product_data: {
            name: product.productName,
            description: product.customDetail,
            images: [product?.productCover[0]?.cover],
          },
          unit_amount_decimal: +product.price,
        },
        quantity: +item.quantity,
      });
    }
    if (discount == 0 && newTransaction.discount == 0) {
      const url = await stripe.payment(line_item);
      return res.status(200).json({ url, newTransaction });
    }
    const url = await stripe.paymentWithDiscount(line_item, discount * 100);
    res.status(200).json({ url, newTransaction });
    // res.status(201).json({ transaction: newTransaction, itemPayment });
  } catch (err) {
    next(err);
  }
  return;
};

// USER UPDATE TRANSACTION
module.exports.updateTransaction = async (req, res, next) => {
  try {
    // FIND transaction
    const transaction =
      await repo.transaction.getTransactionPenddingbyTransactionId(
        req.transactionId
      );
    if (!transaction)
      throw new CustomError("transaction not found", "WRONG_INPUT", 400);
    if (req.body.status === TransactionStatus.FAIL) {
      // STATUS fail
      console.log("Fail");
      const point = transaction.discount * 100;
      const { newTransactionStatus } = await canCelTransaction(
        req.transactionId,
        point,
        transaction.userId
      );
      return res.status(200).json({ newTransactionStatus });
    } else if (req.body.status === TransactionStatus.COMPLETE) {
      // STATUS complete
      console.log("Complete");
      const point = Math.round(transaction.totalAmount / 10);
      const newTransactionStatus = await completeTransaction(
        req.transactionId,
        point,
        transaction.userId
      );
      sendEmail(
        "jkurathong@gmail.com",
        "ORDER COMPLETE",
        "your payment was success"
      );
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

// ADMIN GET ALL TRANSACTION
module.exports.getAllTransaction = async (req, res, next) => {
  try {
    const transaction = await repo.transaction.getAllTransaction();
    res.status(200).json({ transaction });
  } catch (err) {
    next(err);
  }
  return;
};

// ADMIN GET ALL FAIL TRANSACTION
module.exports.getAllFailTransaction = async (req, res, next) => {
  try {
    const transaction = await repo.transaction.getAllFailTransaction();
    res.status(200).json({ transaction });
  } catch (err) {
    next(err);
  }
  return;
};

// ADMIN GET ALL COMPLETE TRANSACTION
module.exports.getAllCompleteTransaction = async (req, res, next) => {
  try {
    const transaction = await repo.transaction.getAllCompleteTransaction();
    res.status(200).json({ transaction });
  } catch (err) {
    next(err);
  }
  return;
};

// for backend only use to test
module.exports.deleteTransaction = async (req, res, next) => {
  try {
    await repo.transaction.deleteTransaction(req.transactionId);
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
  return;
};
