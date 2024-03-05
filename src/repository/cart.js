const prisma = require("../config/prisma");

// สร้าง cartItem ของ user
module.exports.createCartItem = async (data) =>
  await prisma.cartItems.create({ data });
// ดู cart ของ user
module.exports.getCartbyUserId = async (userId) =>
  await prisma.cart.findFirst({ where: { userId } });
// ดูว่ามี product อยู่มั้ยและ active มั้ย
module.exports.getProductByProductId = async (id) =>
  await prisma.products.findFirst({ where: { id } });
// สร้าง cart ของ user
module.exports.createCart = async (data) => await prisma.cart.create({ data });
// ดู cartItem ทัั้งหมด ของ user
module.exports.getAllItemIncartByCartId = async (cartId) =>
  await prisma.cartItems.findMany({
    where: { cartId, products: { isActive: true } },
    include: {
      products: {
        select: { productName: true, productCover: true },
      },
    },
  });
// ดู cartItem
module.exports.getItemById = async (id) =>
  await prisma.cartItems.findFirst({ where: { id } });
// ดู cartItem by productId and cartId
module.exports.getItemByproductIdAndCartId = async (productId, cartId) =>
  await prisma.cartItems.findFirst({ where: { productId, cartId } });
// อัพเดท cartItem
module.exports.updateCartItem = async (data, id) =>
  await prisma.cartItems.update({ where: { id }, data });
// ลบ cartItem in cart
module.exports.deleteItemIncart = async (id) =>
  await prisma.cartItems.delete({ where: { id } });
// ดู cartItem จาก id
module.exports.getCartItemByCartItemId = async (id) =>
  await prisma.cartItems.findMany({
    where: { id: { in: id } },
    select: { quantity: true, price: true, productId: true },
  });
// ลบ cartItem ทั้งหมดที่ถูกส่งเข้ามาโดย id
module.exports.deleteAllCartItemById = async (id) =>
  await prisma.cartItems.deleteMany({ where: { id: { in: id } } });
