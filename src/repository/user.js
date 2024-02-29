const { Role } = require("@prisma/client");
const prisma = require("../config/prisma");

// =========================================== BASIC CRUD ===================================
module.exports.get = async (where) => await prisma.user.findUnique({ where });
module.exports.getAll = async () =>
  await prisma.user.findMany({
    where: { role: Role.USER },
    select: { email, id, isActive },
  });
module.exports.getAllAdmin = async () =>
  await prisma.user.findMany({
    where: { role: Role.ADMIN },
    select: { email, isActive, id },
  });
module.exports.getOne = async (email) =>
  await prisma.user.findFirst({ where: { email } });
module.exports.create = async (data) => await prisma.user.create({ data });
module.exports.update = async ({ id }, data) =>
  await prisma.user.update({ where: { id }, data });
module.exports.delete = async ({ id }) =>
  await prisma.user.delete({ where: { id } });

// =========================================== CUSTOM REPOSITORY ===================================
