const { Role } = require("@prisma/client");
const prisma = require("../config/prisma");

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
// สร้าง itemPayment
module.exports.createItemPayment = async (data) =>
  await prisma.itemPayment.createMany({ data });
// หา user subscribe
module.exports.userSub = async () =>
  await prisma.userSubscribe.findMany({ where: { isSubscribe: true } });
// ลบ user
module.exports.delete = async (id) =>
  await prisma.user.delete({ where: { id } });

// =========================================== CUSTOM REPOSITORY ===================================
