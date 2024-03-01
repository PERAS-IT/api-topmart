const { Role } = require("@prisma/client");
const prisma = require("../config/prisma");

// =========================================== BASIC CRUD ===================================
// ดู user
module.exports.get = async (where) => await prisma.user.findUnique({ where });
// ดู user ทั้งหมด
module.exports.getAll = async () =>
  await prisma.user.findMany({
    where: { role: Role.USER },
    select: { email, id, isActive },
  });
// ดู admin ทั้งหมด
module.exports.getAllAdmin = async () =>
  await prisma.user.findMany({
    where: { role: Role.ADMIN },
    select: { email, isActive, id },
  });
// ดู user จาก email
module.exports.getOne = async (email) =>
  await prisma.user.findFirst({ where: { email } });
// ดู user จาก id user
module.exports.getOneById = async (id) =>
  await prisma.user.findFirst({ where: { id } });
// แบน user
module.exports.bannedUser = async (id) =>
  await prisma.user.update({ data: { isActive: false } });
// ปลดแบน user
module.exports.unbannedUser = async (id) =>
  await prisma.user.update({ data: { isActive: true } });
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
// ลบ user address
module.exports.deleteUserAddress = async (id) =>
  await prisma.userAddress.delete({ where: { id } });
// แก้ไข user address
module.exports.editAddress = async (id, data) =>
  await prisma.userAddress.update({ where: { id }, data });
// ดู user address ทั้งหมด
module.exports.getAllUserAddress = async (userId) =>
  await prisma.userAddress.findMany({ where: { userId } });
// ลบ user
module.exports.delete = async ({ id }) =>
  await prisma.user.delete({ where: { id } });

// =========================================== CUSTOM REPOSITORY ===================================
