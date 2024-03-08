const { CustomError } = require("../config/error");
const repo = require("../repository");
const stripe = require("../utils/stripe");

module.exports.createPayment = async (req, res, next) => {
  try {
    const transaction =
      await repo.transaction.getTransactionPenddingbyTransactionId(
        req.transactionId
      );
    if (!transaction)
      throw new CustomError("transaction not found", "WRONG_INPUT", 400);
    const itemPayment = await repo.itemPayment.getAllItemPaymentByTransactionId(
      req.transactionId
    );
    if (!itemPayment)
      throw new CustomError("itemPayment not found", "WRONG_INPUT", 400);
    let line_item = [];
    const discount = transaction.discount || 0;
    if (discount != req.body.discount)
      throw new CustomError("discount not match", "WRONG_INPUT", 400);
    if (req.body.totalAmount != transaction.totalAmount)
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
    console.log(line_item);
    console.log(discount);
    if (discount == 0 && transaction.discount == 0) {
      const url = await stripe.payment(line_item);
      return res.status(200).json({ url });
    }
    const url = await stripe.paymentWithDiscount(line_item, discount * 100);
    res.status(200).json({ url });
  } catch (err) {
    next(err);
  }
  return;
};
