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
    include: { itemPayments: true },
  });
// สร้าง transaction
module.exports.createTransaction = async (data) =>
  await prisma.transaction.create({ data });
// อัพเดท transaction
module.exports.updateTransaction = async (data, id) =>
  await prisma.transaction.update({ where: { id }, data });
// หา status ที่หมดเวลา
module.exports.findExpireTransaction = async (threeday) =>
  await prisma.transaction.findMany({
    where: { createdAt: { lte: threeday }, status: TransactionStatus.PENDING },
  });
// ยกเลิก transaction
module.exports.cancelTransaction = async (id) =>
  await prisma.transaction.update({
    where: { id },
    data: { status: TransactionStatus.FAIL },
  });
// ดู transaction pending by transactionId
module.exports.getTransactionPenddingbyTransactionId = async (id) =>
  await prisma.transaction.findFirst({
    where: { id, status: TransactionStatus.PENDING },
  });
// ลบ  transaction
module.exports.deleteTransaction = async (id) =>
  await prisma.transaction.delete({
    where: { id, status: TransactionStatus.PENDING },
  });
