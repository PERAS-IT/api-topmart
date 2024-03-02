const Joi = require("joi");
const validate = require("./validator");

const profileSchema = Joi.object({
  nickName: Joi.string(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,10}$/)
    .messages({
      "string.pattern.base": "phone must be number 0-9",
    }),
  birthDate: Joi.string(),
  gender: Joi.string(),
});

exports.validateProfile = validate(profileSchema);
