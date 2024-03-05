const Joi = require("joi");
const { CustomError } = require("../../config/error");

const productIdSchema = Joi.object({
  productId: Joi.string().required(),
});

exports.validateProductId = (req, res, next) => {
  const { error, value } = productIdSchema.validate(req.params);
  if (error)
    throw new CustomError("invalided pattern of productId", "WRONG_INPUT", 400);
  req.productId = value.productId;
  next();
};
