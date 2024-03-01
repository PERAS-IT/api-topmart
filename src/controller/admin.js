const repo = require("../repository");
const utils = require("../utils");
const { CustomError } = require("../config/error");
const { Role } = require("@prisma/client");

// REGISTER ADMIN
module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // CHECK role
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
    // CREATE empty userProfile
    await repo.user.createUserProfile(admin.id);
    // Sign token
    const token = utils.jwt.sign(admin);

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
  return;
};
// GET ALL USER
module.exports.getAllUser = async (req, res, next) => {
  try {
    const allUser = await repo.user.getAllUserWithUserProfile();
    res.status(200).json({ user: allUser });
  } catch {
    next(err);
  }
  return;
};
// GET ALL ADMIN
module.exports.getAllAdmin = async (req, res, next) => {
  try {
    const allAdmin = await repo.user.getAllAdmin();
    res.status(200).json({ user: allAdmin });
  } catch (err) {
    next(err);
  }
  return;
};
// BAN USER
module.exports.bannedUser = async (req, res, next) => {
  try {
    // Find user
    const user = await repo.user.getOneById(req.userId);
    if (!user) throw new CustomError("user not found", "WRONG_INPUT", 400);
    // Check user role
    if (user.role !== Role.USER)
      throw new CustomError("forbidden", "FORBIDDEN", 403);
    // Check user status
    if (user.isActive === false)
      throw new CustomError("user already banned", "WRONG_INPUT", 400);
    // Ban user
    await repo.user.bannedUser(req.userId);
    user.isActive = false;
    delete user.password;
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
  return;
};
// UNBAN USER
module.exports.unbannedUser = async (req, res, next) => {
  try {
    // Find user
    const user = await repo.user.getOneById(req.userId);
    if (!user) throw new CustomError("user not found", "WRONG_INPUT", 400);
    // Check user role
    if (user.role !== Role.USER)
      throw new CustomError("forbidden", "FORBIDDEN", 403);
    // Check user status
    if (user.isActive === true)
      throw new CustomError("user already unbanned", "WRONG_INPUT", 400);
    // Ban user
    await repo.user.unbannedUser(req.userId);
    user.isActive = true;
    delete user.password;
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
  return;
};
// BAN ALL USER
module.exports.bannedBySuperAdmin = async (req, res, next) => {
  try {
    // Find user
    const user = await repo.user.getOneById(req.userId);
    if (!user) throw new CustomError("admin not found", "WRONG_INPUT", 400);
    // Check user status
    if (user.isActive === false)
      throw new CustomError("user already banned", "WRONG_INPUT", 400);
    // Ban user
    await repo.user.bannedUser(req.userId);
    user.isActive = false;
    delete user.password;
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
  return;
};
// UNBAN ALL USER
module.exports.unbannedBySuperAdmin = async (req, res, next) => {
  try {
    // Find user
    const user = await repo.user.getOneById(req.userId);
    if (!user) throw new CustomError("user not found", "WRONG_INPUT", 400);
    // Check user status
    if (user.isActive === true)
      throw new CustomError("user already unbanned", "WRONG_INPUT", 400);
    // Ban user
    await repo.user.unbannedUser(req.userId);
    user.isActive = true;
    delete user.password;
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
  return;
};
