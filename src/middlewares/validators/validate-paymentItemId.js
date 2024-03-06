const Joi = require("joi");
const { CustomError } = require("../../config/error");

const paymentItemIdSchema = Joi.object({
  itemPaymentId: Joi.number().positive().positive(),
});

exports.validatepaymentItemId = (req, res, next) => {
  const { error, value } = paymentItemIdSchema.validate(req.params);
  console.log(req.params);
  if (error)
    throw new CustomError(
      "invalid pattern of paymentItemId ",
      "WRONG_INPUT",
      400
    );
  req.itemPaymentId = value.itemPaymentId;
  next();
};
