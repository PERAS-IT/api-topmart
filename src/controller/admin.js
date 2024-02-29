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
    const { email, password } = req.body;
    // Find admin from user table
    const admin = await repo.user.getOne(email);
    if (!admin)
      throw new CustomError(
        "username or password is wrong",
        "WRONG_INPUT",
        400
      );
    // Check admin status
    if (admin.isActive === false)
      throw new CustomError("user was banned", "FORBIDDEN", 403);
    // Compare password
    const result = await utils.bcrypt.compare(password, admin.password);
    if (!result)
      throw new CustomError(
        "username or password is wrong",
        "WRONG_INPUT",
        400
      );
    delete admin.password;
    // Create token
    const token = utils.jwt.sign(admin);
    res.status(200).json({ user: admin, token });
  } catch (err) {
    next(err);
  }
  return;
};

module.exports.getAllUser = async (req, res, next) => {
  const allUser = repo.user.getAll();
  res.status(200).json({ user: allUser });
};

module.exports.getAllAdmin = async (req, res, next) => {};
