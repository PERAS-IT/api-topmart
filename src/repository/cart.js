const prisma = require("../config/prisma");

// สร้าง cartItem ของ user
module.exports.createCartItem = async (data) =>
  await prisma.cartItems.create({ data });
// ดู cart ของ user
module.exports.getCartbyUserId = async (userId) =>
  await prisma.cart.findFirst({ where: { userId } });
// สร้าง cart ของ user
module.exports.createCart = async (data) => await prisma.cart.create({ data });
// ดู cartItem ทัั้งหมด ของ user
module.exports.getAllItemIncartByCartId = async (cartId) =>
  await prisma.cartItems.findMany({ where: { cartId } });
// ดู cartItem
module.exports.getItemById = async (id) =>
  await prisma.cartItems.findFirst({ where: { id } });
// ลบ cartItem in cart
module.exports.deleteItemIncart = async (id) =>
  await prisma.cartItems.delete({ where: { id } });
module.exports.getCartItemByCartItemId = async (id) =>
  await prisma.cartItems.findMany({
    where: { id: { in: id } },
    select: { quantity: true, price: true, productId: true },
  });
