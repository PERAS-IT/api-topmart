const prisma = require("../config/prisma");

// ดู transaction
module.exports.getTransactionByUserId = async (userId) =>
  await prisma.transaction.findFirst({ where: { userId } });
// สร้าง transaction
module.exports.createTransaction = async (data) =>
  await prisma.transaction.create({ data });
// อัพเดท transaction
module.exports.updateTransaction = async (data, id) =>
  await prisma.transaction.update({ where: { id }, data });
// ลบ  transaction
module.exports.deleteTransaction = async (id) =>
  await prisma.transaction.delete({ where: { id } });
