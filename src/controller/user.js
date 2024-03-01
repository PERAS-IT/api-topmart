const repo = require("../repository");
const utils = require("../utils");
const { CustomError } = require("../config/error");
const { Role } = require("@prisma/client");

// LOGIN
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // GET username from database
    const user = await repo.user.get({ email });
    if (!user)
      throw new CustomError(
        "username or password is wrong",
        "WRONG_INPUT",
        400
      );
    if (user.isActive === false)
      throw new CustomError("user was banned", "FORBIDDEN", "403");

    // COMPARE password with database
    const result = await utils.bcrypt.compare(password, user.password);
    if (!result)
      throw new CustomError(
        "username or password is wrong",
        "WRONG_INPUT",
        400
      );

    // DELETE KEY of password from user data
    delete user.password;
    // SIGN token from user data
    const token = utils.jwt.sign(user);
    res.status(200).json({ user, token });
  } catch (err) {
    next(err);
  }
  return;
};
// REGISTER
module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    let role = Role.USER;
    const searchUser = await repo.user.getOne(email);
    //Find user by email
    if (searchUser) {
      throw new CustomError("email has been used", "WRONG_INPUT", 400);
    }
    // HASHED PASSWORD
    const hashed = await utils.bcrypt.hashed(password);
    // CREATE user to database
    const user = await repo.user.create({ email, password: hashed, role });
    // DELETE KEY of password from user data
    delete user.password;
    // CREATE empty userProfile
    await repo.user.createUserProfile(user.id);
    // SIGN token from user data
    const token = utils.jwt.sign(user);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
  return;
};
// EDIT PROFILE
module.exports.editProfile = async (req, res, next) => {
  try {
    // FIND user by id
    const { id } = req.user;
    const user = await repo.user.getOneById(id);
    if (!user) throw new CustomError("user not found", "WRONG_INPUT", 400);
    // EDIT userProfile
    const userProfile = await repo.user.editUserProfile(id, req.body);
    res.status(200).json({ userProfile });
  } catch (err) {
    next(err);
  }
  return;
};
// GET ME
module.exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
  return;
};
// SEE USER PROFILE
module.exports.getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const userProfile = await repo.user.getUserProfile(id);
    res.status(200).json({ userProfile });
  } catch (err) {
    next(err);
  }
  return;
};
// CREATE USER ADDRESS
module.exports.createUserAddress = async (req, res, next) => {
  try {
    console.log(req.body);
    req.body.userId = req.user.id;
    const userAddress = await repo.user.createUserAddress(req.body);
    res.status(201).json({ userAddress });
  } catch (err) {
    next(err);
  }
  return;
};
// DELETE USER ADDRESS
module.exports.deleteUserAddress = async (req, res, next) => {
  try {
    // FIND address by addressId
    const address = await repo.user.getUserAddressById(req.addressId);
    console.log(address);
    if (!address)
      throw new CustomError("userAddress not found", "WRONG_INPUT", 400);
    // DELETE address
    await repo.user.deleteUserAddress(req.addressId);
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
  return;
};
// UPDATE USER ADDRESS
module.exports.editUserAddress = async (req, res, next) => {
  try {
    // FIND userAddress
    const address = await repo.user.getUserAddressById(req.addressId);
    if (!address)
      throw new CustomError("address not found", "WRONG_INPUT", 400);
    // EDIT userAddress
    const userAddress = await repo.user.editAddress(req.addressId, req.body);
    res.status(200).json({ userAddress });
  } catch (err) {
    next(err);
  }
  return;
};
// SEE ALL USER ADDRESS
module.exports.getAllUserAddress = async (req, res, next) => {
  try {
    const allAddress = await repo.user.getAllUserAddress(req.user.id);
    res.status(200).json({ allAddress });
  } catch (err) {
    next(err);
  }
  return;
};
// USER SUBSCRIBE WEB
module.exports.subscribeWeb = async (req, res, next) => {
  try {
    const id = req.user.id;
    const isSubscribe = req.body.isSubscribe;
    req.body.userId = id;
    const isSub = await repo.user.getSubscribe(id);
    if (!isSub && isSubscribe) {
      await repo.user.createSub(req.body);
      return res.status(200).json({ message: "subscribe success" });
    }
    const data = await repo.user.updateSub(req.body, id);
    if (data.isSubscribe === true)
      return res.status(200).json({ message: "subscribe success" });
    res.status(200).json({ message: "unSubscribe success" });
  } catch (err) {
    next(err);
  }
  return;
};

module.exports.delete = async (req, res, next) => {
  try {
    console.log(req.userId);
    await repo.user.delete({ id: req.userId });
    res.status(200);
  } catch (err) {
    next(err);
  }
  return;
};
