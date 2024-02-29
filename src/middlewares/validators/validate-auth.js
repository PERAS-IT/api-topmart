const Joi = require("joi");
const validate = require("./validator");

const registerSchema = Joi.object({
  email: Joi.string().required().trim().email({ tlds: false }).message({
    "string.empty": "invalid email address or mobile number",
    "any.required": "invalid email address or mobile number",
  }),
  password: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9]{6,}$/)
    .message({
      "string.empty": "password is required",
      "any.required": "password is required",
      "string.pattern.base": "password must be at least 6 characters ",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "string.empty": "confirm password is required",
      "any.required": "confirm password is required",
      "any.only": "password and confirm password did not match",
    })
    .strip(),
});

const loginSchema = Joi.object({
  email: Joi.string().required().trim().email({ tlds: false }).message({
    "string.empty": "invalid email address or mobile number",
    "any.required": "invalid email address or mobile number",
  }),
  password: Joi.string()
    .required()
    .trim()
    .pattern(/^[a-zA-Z0-9]{6,}$/)
    .message({
      "string.empty": "password is required",
      "any.required": "password is required",
      "string.pattern.base": "password must be at least 6 characters ",
    }),
});

exports.validateRegister = validate(registerSchema);
exports.validateLogin = validate(loginSchema);
