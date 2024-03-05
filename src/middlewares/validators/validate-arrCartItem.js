const Joi = require("joi");
const { CustomError } = require("../../config/error");

const cartItemSchema = Joi.object({
  cartItemId: Joi.string().required(),
});

exports.validateArrCart = (req, res, next) => {
  const { error, value } = cartItemSchema.validate(req.params);
  if (error)
    throw new CustomError(
      "invalided pattern of cartItemId",
      "WRONG_INPUT",
      400
    );
  req.cartItemId = value.cartItemId;
  next();
};
