const { TransactionStatus } = require("@prisma/client");
const prisma = require("../config/prisma");

module.exports.getThirtyDayTran = async (thirty, tomorrow) =>
  prisma.transaction.findMany({
    where: {
      createdAt: { gte: thirty, lte: tomorrow },
      // status: TransactionStatus.COMPLETE,
    },
  });
