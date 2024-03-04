const Joi = require("joi");
const validate = require("./validator");
const { CustomError } = require("../../config/error");

const cartItemIdSchema = Joi.object({
  cartItemId: Joi.number().required().positive(),
});

exports.validateCartItemId = (req, res, next) => {
  const { value, error } = cartItemIdSchema.validate(req.params);
  if (error)
    throw new CustomError(
      "invalided pattern of cartItemId",
      "WRONG_INPUT",
      400
    );
  req.cartItemId = value.cartItemId;
  next();
};
