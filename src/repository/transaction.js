const { TransactionStatus } = require("@prisma/client");
const prisma = require("../config/prisma");

// ดู transaction
module.exports.getTransactionPendingByUserId = async (userId) =>
  await prisma.transaction.findFirst({
    where: { userId, status: TransactionStatus.PENDING },
  });
// ดู transaction ทั้งหมดของ user
module.exports.getAllTransactionByUserId = async (userId) =>
  await prisma.transaction.findMany({
    where: { userId },
    include: { itempayments: true },
  });
// สร้าง transaction
module.exports.createTransaction = async (data) =>
  await prisma.transaction.create({ data });
// อัพเดท transaction
module.exports.updateTransaction = async (data, id) =>
  await prisma.transaction.update({ where: { id }, data });
// ลบ  transaction
module.exports.deleteTransaction = async (id) =>
  await prisma.transaction.delete({ where: { id } });
