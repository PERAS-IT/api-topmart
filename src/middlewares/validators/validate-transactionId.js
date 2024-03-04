const Joi = require("joi");
const validate = require("./validator");
const { CustomError } = require("../../config/error");

const transactionIdSchema = Joi.object({
  transactionId: Joi.number().required().positive(),
});

exports.validateTransactionId = (req, res, next) => {
  const { error, value } = validate(transactionIdSchema);
  if (error)
    throw new CustomError(
      "invalided pattern of transactionId",
      "WRONG_INPUT",
      400
    );
  req.transactionId = value.transactionId;
  next();
};
