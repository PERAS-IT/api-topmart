const { TransactionStatus } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
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
const { changeDomain } = require("../utils/change-domain-mail");

// USER CREATE TRANSACTION
module.exports.createTransaction = async (req, res, next) => {
  try {
    // FIND transaction
    const cartItemId = req.body.cartItemId;
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
    req.body.billNumber = uuidv4();
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
      console.log(product);
      line_item.push({
        price_data: {
          currency: "thb",
          product_data: {
            name: product.productName,
            description: product.customDetail || "No detail",
            images: [product?.productCover[0]?.cover],
          },
          unit_amount_decimal: +product.price * 100,
        },
        quantity: +item.quantity,
      });
    }
    console.log("**********************", line_item);
    if (discount == 0 && newTransaction.discount == 0) {
      const url = await stripe.payment(line_item, newTransaction.billNumber);
      return res.status(200).json({ url });
    }
    const url = await stripe.paymentWithDiscount(
      line_item,
      discount * 100,
      newTransaction.billNumber
    );
    res.status(200).json({ url });
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
      await repo.transaction.getTransactionPenddingbyTransactionId(req.body.id);
    if (!transaction)
      throw new CustomError("transaction not found", "WRONG_INPUT", 400);
    if (req.body.status === TransactionStatus.FAIL) {
      // STATUS fail
      const point = transaction.discount * 100;
      const { newTransactionStatus } = await canCelTransaction(
        req.transactionId,
        point,
        transaction.userId
      );
      return res.status(200).json({ newTransactionStatus });
    } else if (req.body.status === TransactionStatus.COMPLETE) {
      // STATUS complete
      const point = Math.round(transaction.totalAmount / 10);
      const newTransactionStatus = await completeTransaction(
        req.transactionId,
        point,
        transaction.userId
      );
      const user = await repo.user.getOneById(newTransactionStatus.userId);
      const setDomain = changeDomain(user.email);
      const paymentDetail = `payment detail has been send to ${setDomain}`;
      const text = `Your payment has been successful with a total amount of ${
        +newTransactionStatus.totalAmount - +newTransactionStatus.discount
      } Baht. You have earn ${
        +newTransactionStatus.totalAmount / 10
      } loyalty points. 
      If you have any questions or concerns regarding the purchase of our products or services, please contact our customer service. Thank you.`;
      sendEmail("jkurathong@gmail.com", "ORDER COMPLETE", text);
      return res.status(200).json({ newTransactionStatus, paymentDetail });
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
