const Joi = require("joi");
const validate = require("./validator");

const profileSchema = Joi.object({
  nickName: Joi.string().allow(null).allow(""),
  phone: Joi.string()
    .allow(null)
    .allow("")
    .pattern(/^[0-9]{10,10}$/)
    .messages({
      "string.pattern.base": "phone must be number 0-9",
    }),
  birthDate: Joi.string().allow(null).allow(""),
  gender: Joi.string().allow(null).allow(""),
});

exports.validateProfile = validate(profileSchema);
