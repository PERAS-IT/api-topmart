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
module.exports.findExpireTransaction = async (fifteenMn) =>
  await prisma.transaction.findMany({
    where: { createdAt: { lt: fifteenMn }, status: TransactionStatus.PENDING },
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
// ดู transaction ทั้งหมด
module.exports.getAllTransaction = async () =>
  await prisma.transaction.findMany({
    include: { user: { select: { email: true } } },
  });
// ดู​ transaction fail ทั้งหมด
module.exports.getAllFailTransaction = async () =>
  await prisma.transaction.findMany({
    where: { status: TransactionStatus.FAIL },
    include: { user: { select: { email: true } } },
  });
// ดู transaction complete ทั้งหมด
module.exports.getAllCompleteTransaction = async () =>
  await prisma.transaction.findMany({
    where: { status: TransactionStatus.COMPLETE },
    include: { user: { select: { email: true } } },
  });
// ลบ  transaction
module.exports.deleteTransaction = async (id) =>
  await prisma.transaction.delete({
    where: { id, status: TransactionStatus.PENDING },
  });
