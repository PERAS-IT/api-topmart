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
    console.log(user.id);
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
    if (req.body.birthDate) {
      const date = new Date(req.body.birthDate);
      req.body = { ...req.body, birthDate: date };
    }
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
    const id = req.userId;
    const isAddress = await repo.user.getAllUserAddress(id);
    if (isAddress) req.body.setDefault = false;
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
    // CHECK address.userId == userid
    if (address.userId !== req.user.id)
      throw new CustomError("forbidden", "FORBIDDEN", 403);
    // CHECK has any account setdefaule true
    if (req.body.setDefault === true) {
      const hasTrue = await repo.user.getUserAddressSetDefault(req.user.id);
      if (hasTrue)
        await repo.user.editAddress(hasTrue.id, { setDefault: false });
    }
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
    // CHECK user has ever been sub
    const isSub = await repo.user.getSubscribe(id);
    if (!isSub && isSubscribe) {
      await repo.user.createSub(req.body);
      return res.status(200).json({ message: "subscribe success" });
    }
    // USER has ever been sub
    const data = await repo.user.updateSub(req.body, id);
    if (data.isSubscribe === true)
      return res.status(200).json({ message: "subscribe success" });
    // UNSUB
    res.status(200).json({ message: "unSubscribe success" });
  } catch (err) {
    next(err);
  }
  return;
};
// USER DELETE ACCOUNT
module.exports.deleteAccount = async (req, res, next) => {
  try {
    // FIND user
    const user = await repo.user.getOneById(req.user.id);
    if (!user) throw new CustomError("user not found", "WRONG_INPUT", 400);
    // SOFT delete user
    await repo.user.bannedUser(req.user.id);
    res.status(200).json({ message: "delete account success" });
  } catch (err) {
    next(err);
  }
  return;
};
// USER UPDATE CARTITEM IN CART
module.exports.updateCart = async (req, res, next) => {
  try {
    // FIND cart
    const cart = await repo.user.getCartbyUserId(req.user.id);
    // IF no cart create cart then create cartItem
    if (!cart) {
      const newCart = await repo.user.createCart({ userId: req.user.id });
      req.body.cartId = newCart.id;
      const cartItem = await repo.user.createCartItem(req.body);
      return res.status(200).json({ cart: cartItem });
    }
    // IF have cart create new cartItem
    req.body.cartId = cart.id;
    await repo.user.createCartItem(req.body);
    const allItemInCart = await repo.user.getAllItemIncartByCartId(cart.id);
    res.status(200).json({ cart: allItemInCart });
  } catch (err) {
    next(err);
  }
  return;
};
// USER DELETE CARTITEM IN CART
module.exports.deleteItemInCart = async (req, res, next) => {
  try {
    const cartItem = await repo.user.getItemById(req.cartItemId);
    if (!cartItem)
      throw new CustomError("cartItem not found", "WRONG_INPUT", 400);
    await repo.user.deleteItemIncart(req.cartItemId);
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
  return;
};
// USER SEE ALL ITEM IN CART
module.exports.getAllItemInCart = async (req, res, next) => {
  try {
    const id = req.user.id;
    const cart = await repo.user.getCartbyUserId(id);
    if (!cart) {
      const newCart = await repo.user.createCart({ userId: id });
      const cartItem = await repo.user.getAllItemIncartByCartId(newCart.id);
      return res.status(200).json({ cart: cartItem });
    }
    const cartItem = await repo.user.getAllItemIncartByCartId(cart.id);
    res.status(200).json({ cart: cartItem });
  } catch (err) {
    next(err);
  }
  return;
};
module.exports.delete = async (req, res, next) => {
  try {
    console.log(req.userId);
    await repo.user.delete(req.userId);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
  return;
};
