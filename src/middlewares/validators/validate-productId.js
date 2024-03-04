const Joi = require("joi");
const validate = require("./validator");
const { CustomError } = require("../../config/error");

const productIdSchema = Joi.object({
  productId: Joi.number().required().positive(),
});

exports.validateProductId = (req, res, next) => {
  const { error, value } = validate(productIdSchema);
  if (error)
    throw new CustomError("invalided pattern of productId", "WRONG_INPUT", 400);
  req.productId = value.productId;
  next();
};
