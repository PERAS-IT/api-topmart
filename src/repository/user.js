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
// อัพเดท user profile
module.exports.update = async ({ id }, data) =>
  await prisma.user.update({ where: { id }, data });
module.exports.delete = async ({ id }) =>
  await prisma.user.delete({ where: { id } });

// =========================================== CUSTOM REPOSITORY ===================================
