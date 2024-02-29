const repo = require("../repository");
const utils = require("../utils");
const { CustomError } = require("../config/error");
const { Role } = require("@prisma/client");

module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const role = Role.ADMIN;
    // Find user by email
    const searchUser = await repo.user.getOne(email);
    if (searchUser)
      throw new CustomError("email has been used", "WRONG_INPUT", 400);
    // hashed password
    const hashed = await utils.bcrypt.hashed(password);
    // Create user role admin to database
    const admin = await repo.user.create({ email, password: hashed, role });
    // Delete password
    delete admin.password;
    // Sign token
    const token = utils.jwt.sign(admin);

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
  } catch (err) {
    const { email, password } = req.body;
    if (req.user.isActive === false) throw new CustomError(4);
  }
};
