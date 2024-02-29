const Joi = require("joi");
const { CustomError } = require("../../config/error");

const userIdSchema = Joi.object({
  id: Joi.number().required().positive(),
});

exports.validateUserId = (req, res, next) => {
  console.log(req.params);
  const { value, error } = userIdSchema.validate(req.params);
  if (error) throw new CustomError("invalided userId", "WRONG_INPUT", 400);

  req.userId = value.id;
  next();
};
