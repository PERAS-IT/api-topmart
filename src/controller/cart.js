const { CustomError } = require("../config/error");
const repo = require("../repository");

// USER UPDATE CARTITEM IN CART
module.exports.updateCart = async (req, res, next) => {
  try {
    // FIND product and check status
    const haveProduct = await repo.cart.getProductByProductId(
      req.body.productId
    );
    if (!haveProduct || haveProduct.isActive === false)
      throw new CustomError("product not available now", "WRONG_INPUT", 400);
    // FIND cart
    const cart = await repo.cart.getCartbyUserId(req.user.id);
    // IF no cart create cart then create cartItem
    if (!cart) {
      const newCart = await repo.cart.createCart({ userId: req.user.id });
      req.body.cartId = newCart.id;
      await repo.cart.createCartItem(req.body);
      const allItemInCart = await repo.cart.getAllItemIncartByCartId(
        newCart.id
      );
      return res.status(200).json({ cart: allItemInCart });
    }
    // IF have cart create new cartItem
    req.body.cartId = cart.id;
    const haveItem = await repo.cart.getItemByproductIdAndCartId(
      req.body.productId,
      cart.id
    );
    if (haveItem) {
      newItem = await repo.cart.updateCartItem(req.body, haveItem.id);
      const allItemInCart = await repo.cart.getAllItemIncartByCartId(cart.id);
      return res.status(200).json({ cart: allItemInCart });
    }
    await repo.cart.createCartItem(req.body);
    const allItemInCart = await repo.cart.getAllItemIncartByCartId(cart.id);
    res.status(200).json({ cart: allItemInCart });
  } catch (err) {
    next(err);
  }
  return;
};
// USER DELETE CARTITEM IN CART
module.exports.deleteItemInCart = async (req, res, next) => {
  try {
    const cartItem = await repo.cart.getItemById(req.cartItemId);
    if (!cartItem)
      throw new CustomError("cartItem not found", "WRONG_INPUT", 400);
    await repo.cart.deleteItemIncart(req.cartItemId);
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
    const cart = await repo.cart.getCartbyUserId(id);
    if (!cart) {
      const newCart = await repo.cart.createCart({ userId: id });
      const cartItem = await repo.cart.getAllItemIncartByCartId(newCart.id);
      return res.status(200).json({ cart: cartItem });
    }
    const cartItem = await repo.cart.getAllItemIncartByCartId(cart.id);
    res.status(200).json({ cart: cartItem });
  } catch (err) {
    next(err);
  }
  return;
};
