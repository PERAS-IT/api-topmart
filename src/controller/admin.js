const repo = require("../repository");
const utils = require("../utils");
const { CustomError } = require("../config/error");
const { Role } = require("@prisma/client");
// const { user } = require(".");

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

// module.exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     // Find admin from user table
//     const admin = await repo.user.getOne(email);
//     if (!admin)
//       throw new CustomError(
//         "username or password is wrong",
//         "WRONG_INPUT",
//         400
//       );
//     // Check admin status
//     if (admin.isActive === false)
//       throw new CustomError("user was banned", "FORBIDDEN", 403);
//     // Compare password
//     const result = await utils.bcrypt.compare(password, admin.password);
//     if (!result)
//       throw new CustomError(
//         "username or password is wrong",
//         "WRONG_INPUT",
//         400
//       );
//     delete admin.password;
//     // Create token
//     const token = utils.jwt.sign(admin);
//     res.status(200).json({ user: admin, token });
//   } catch (err) {
//     next(err);
//   }
//   return;
// };

module.exports.getAllUser = async (req, res, next) => {
  const allUser = await repo.user.getAllUserWithUserProfile();
  res.status(200).json({ user: allUser });
};

module.exports.getAllAdmin = async (req, res, next) => {
  const allAdmin = await repo.user.getAllAdmin();
  res.status(200).json({ user: allAdmin });
};

module.exports.bannedUser = async (req, res, next) => {
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
};

module.exports.unbannedUser = async (req, res, next) => {
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
};

module.exports.bannedAdmin = async (req, res, next) => {
  // Find user
  const admin = await repo.user.getOneById(req.userId);
  if (!admin) throw new CustomError("admin not found", "WRONG_INPUT", 400);
  // Check user role
  if (user.role !== Role.ADMIN)
    throw new CustomError("forbidden", "FORBIDDEN", 403);
  // Check admin status
  if (user.isActive === false)
    throw new CustomError("user already banned", "WRONG_INPUT", 400);
  // Ban admin
  await repo.user.bannedUser(req.userId);
  user.isActive = false;
  delete user.password;
  res.status(200).json({ user });
};
