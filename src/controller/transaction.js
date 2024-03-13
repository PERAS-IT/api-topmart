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
      line_item.push({
        price_data: {
          currency: "thb",
          product_data: {
            name: product.productName,
            description: product.customDetail || "Design by TopMart",
            images: [product?.productCover[0]?.cover],
          },
          unit_amount_decimal: +product.price * 100,
        },
        quantity: +item.quantity,
      });
    }
    if (discount == 0 && newTransaction.discount == 0) {
      const url = await stripe.payment(line_item, newTransaction.billNumber);
      return res.status(200).json({ url });
    }
    const url = await stripe.paymentWithDiscount(
      line_item,
      discount * 100,
      newTransaction.billNumber
    );
    res.status(201).json({ url });
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
        transaction.id,
        point,
        transaction.userId
      );
      return res.status(200).json({ newTransactionStatus });
    } else if (req.body.status === TransactionStatus.COMPLETE) {
      // STATUS complete
      const point = Math.floor(
        (transaction.totalAmount - transaction.discount) / 10
      );
      const newTransactionStatus = await completeTransaction(
        transaction.id,
        point,
        transaction.userId
      );
      const user = await repo.user.getOneById(newTransactionStatus.userId);
      const setDomain = changeDomain(user.email);
      const paymentDetail = `payment detail has been send to ${setDomain}`;
      // const texts = `Your payment has been successful with a total amount of ${
      //   +newTransactionStatus.totalAmount - +newTransactionStatus.discount
      // } Baht. You have earn ${Math.floor(
      //   (+newTransactionStatus.totalAmount - +newTransactionStatus.discount) /
      //     10
      // )} loyalty points.
      // If you have any questions or concerns regarding the purchase of our products or services, please contact our customer service. Thank you.`;
      const text = `<h1>Thank you for your payment</h1>
<p>Your payment has been successful with a total amount of ${
        +newTransactionStatus.totalAmount - +newTransactionStatus.discount
      } Bath. You have earn ${Math.floor(
        (+newTransactionStatus.totalAmount - +newTransactionStatus.discount) /
          10
      )} loyalty points</p>
<p>If you have any question or concerns regarding the purchase of our products or services.</p>
<p>Please contact our customer service or send mail to codecamp16.group@gmail.com</p>
<p>Thank you</p>
<svg width="94" height="36" viewBox="0 0 94 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect y="2" width="94" height="31" fill="#D2001F"/>
<path d="M7.36 29V10.28H4.3V6.95H13.66V10.28H10.6V29H7.36ZM19.3309 29.24C18.4309 29.24 17.6559 29.03 17.0059 28.61C16.3659 28.19 15.8709 27.62 15.5209 26.9C15.1809 26.18 15.0109 25.37 15.0109 24.47V11.48C15.0109 10.57 15.1809 9.76 15.5209 9.05C15.8709 8.33 16.3659 7.76 17.0059 7.34C17.6559 6.92 18.4309 6.71 19.3309 6.71C20.2309 6.71 21.0009 6.92 21.6409 7.34C22.2909 7.76 22.7859 8.33 23.1259 9.05C23.4759 9.77 23.6509 10.58 23.6509 11.48V24.47C23.6509 25.37 23.4759 26.18 23.1259 26.9C22.7859 27.62 22.2909 28.19 21.6409 28.61C21.0009 29.03 20.2309 29.24 19.3309 29.24ZM19.3309 26.09C19.7309 26.09 20.0109 25.925 20.1709 25.595C20.3309 25.255 20.4109 24.88 20.4109 24.47V11.48C20.4109 11.07 20.3259 10.7 20.1559 10.37C19.9859 10.03 19.7109 9.86 19.3309 9.86C18.9609 9.86 18.6859 10.03 18.5059 10.37C18.3359 10.7 18.2509 11.07 18.2509 11.48V24.47C18.2509 24.88 18.3359 25.255 18.5059 25.595C18.6759 25.925 18.9509 26.09 19.3309 26.09ZM28.4629 29V19.61L25.1629 6.95H28.3429L29.9329 14L30.0379 14.96H30.1279L30.2329 14L31.8229 6.95H35.0029L31.7029 19.61V29H28.4629Z" fill="white"/>
<path d="M44.2 29V6.95H48.31L50.08 18.38L50.23 19.55H50.29L50.44 18.38L52.21 6.95H56.32V29H53.32V14.21H53.14L53.02 15.14L51.1 29H49.42L47.5 15.14L47.38 14.21H47.2V29H44.2ZM58.0563 29L61.3862 6.95H65.3463L68.6763 29H65.5263L64.9263 24.5H61.8063L61.2063 29H58.0563ZM62.2563 21.08H64.4763L63.5463 13.67L63.4563 12.5H63.2763L63.1863 13.67L62.2563 21.08ZM70.3914 29V6.95H73.6314C75.5714 6.95 77.0014 7.49 77.9214 8.57C78.8414 9.64 79.3014 11.22 79.3014 13.31C79.3014 14.55 79.0814 15.625 78.6414 16.535C78.2114 17.435 77.6864 18.095 77.0664 18.515L79.2714 29H76.0314L74.2014 19.7H73.6314V29H70.3914ZM73.6314 16.7C74.2314 16.7 74.7064 16.57 75.0564 16.31C75.4064 16.04 75.6564 15.66 75.8064 15.17C75.9564 14.68 76.0314 14.1 76.0314 13.43C76.0314 12.38 75.8564 11.575 75.5064 11.015C75.1664 10.445 74.5414 10.16 73.6314 10.16V16.7ZM83.2741 29V10.28H80.2141V6.95H89.5741V10.28H86.5141V29H83.2741Z" fill="white"/>
</svg>`;
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
