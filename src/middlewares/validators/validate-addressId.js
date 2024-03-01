const Joi = require("joi");
const { CustomError } = require("../../config/error");

const addressIdSchema = Joi.object({
  addressId: Joi.number().required().positive(),
});

exports.validateAddressId = (req, res, next) => {
  const { value, error } = addressIdSchema.validate(req.params);
  if (error) throw new CustomError("invalided userId", "WRONG_INPUT", 400);

  req.addressId = value.addressId;
  next();
};
