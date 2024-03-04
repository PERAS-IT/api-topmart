const { Role } = require("@prisma/client");
const prisma = require("../config/prisma");
const { date } = require("joi");

// =========================================== BASIC CRUD ===================================
// ดู user
module.exports.get = async (where) => await prisma.user.findUnique({ where });
// ดู user ทั้งหมด
module.exports.getAllUserWithUserProfile = async () =>
  await prisma.user.findMany({
    where: { role: Role.USER },
    select: {
      email: true,
      id: true,
      isActive: true,
      role: true,
      userProfile: true,
    },
  });
// ดู admin ทั้งหมด
module.exports.getAllAdmin = async () =>
  await prisma.user.findMany({
    where: { role: Role.ADMIN },
    select: { email: true, isActive: true, id: true, role: true },
  });
// ดู user จาก email
module.exports.getOne = async (email) =>
  await prisma.user.findFirst({ where: { email } });
// ดู user จาก id user
module.exports.getOneById = async (id) =>
  await prisma.user.findFirst({ where: { id } });
// แบน user
module.exports.bannedUser = async (id) =>
  await prisma.user.update({ data: { isActive: false }, where: { id } });
// ปลดแบน user
module.exports.unbannedUser = async (id) =>
  await prisma.user.update({ data: { isActive: true }, where: { id } });
// สมัคร user
module.exports.create = async (data) => await prisma.user.create({ data });
// สร้าง user profile
module.exports.createUserProfile = async (userId) =>
  await prisma.userProfile.create({ data: { userId } });
// อัพเดท user profile
module.exports.editUserProfile = async (userId, data) =>
  await prisma.userProfile.update({ where: { userId }, data });
// ดู profile user
module.exports.getUserProfile = async (userId) =>
  await prisma.userProfile.findFirst({ where: { userId } });
// สร้าง user address
module.exports.createUserAddress = async (data) =>
  await prisma.userAddress.create({ data });
// ดู user address ตาม id
module.exports.getUserAddressById = async (id) =>
  await prisma.userAddress.findFirst({ where: { id } });
module.exports.getUserAddressSetDefault = async (userId) =>
  await prisma.userAddress.findFirst({ where: { userId, setDefault: true } });
// ลบ user address
module.exports.deleteUserAddress = async (id) =>
  await prisma.userAddress.delete({ where: { id } });
// แก้ไข user address
module.exports.editAddress = async (id, data) =>
  await prisma.userAddress.update({ where: { id }, data });
// ดู user address ทั้งหมด
module.exports.getAllUserAddress = async (userId) =>
  await prisma.userAddress.findMany({ where: { userId } });
// ดูว่า user เคยกด subscribe ไว้มั้ย
module.exports.getSubscribe = async (userId) =>
  await prisma.userSubscribe.findFirst({ where: { userId } });
// สร้าง ตาราง sub
module.exports.createSub = async (data) =>
  await prisma.userSubscribe.create({ data });
// อัพเดท ตาราง sub
module.exports.updateSub = async (data, userId) =>
  prisma.userSubscribe.update({ where: { userId }, data });
// ลบ account (soft delete)
module.exports.deleteAccount = async (id) =>
  prisma.user.update({ where: id, data: { isActive: false } });
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
// ดู transaction
module.exports.getTransactionByUserId = async (userId) =>
  await prisma.transaction.findFirst({ where: { userId } });
// สร้าง transaction
module.exports.createTransaction = async (data) =>
  await prisma.transaction.create({ data });
// อัพเดท transaction
module.exports.updateTransaction = async (data, id) =>
  await prisma.transaction.update({ where: { id }, data });
// เลือกดู cartitem จาก cartItemId
module.exports.getCartItemByCartItemId = async (id) =>
  await prisma.cartItems.findMany({
    where: { id: { in: id } },
    select: { quantity: true, price: true, productId: true },
  });
module.exports.createItemPayment = async (data) =>
  await prisma.itemPayment.createMany({ data });
// ลบ user
module.exports.delete = async (id) =>
  await prisma.user.delete({ where: { id } });

// =========================================== CUSTOM REPOSITORY ===================================
