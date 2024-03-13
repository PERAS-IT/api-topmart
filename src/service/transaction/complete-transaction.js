const { TransactionStatus, PaymentStatus } = require("@prisma/client");
const prisma = require("../../config/prisma");

// const date = new Date();
// date.setDate(date.getDate() - 3);

const completeTransaction = async (id, point, userId) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // UPDATE transaction status to complete
      const newTransactionStatus = await prisma.transaction.update({
        where: { id },
        data: { status: TransactionStatus.COMPLETE, paymentedAt: new Date() },
      });
      // UPDATE ItemPayment to complete
      await prisma.itemPayment.updateMany({
        where: { transactionId: id },
        data: { payStatus: PaymentStatus.COMPLETE },
      });
      // INCREASE reward point
      await prisma.reward.update({
        where: { userId },
        data: { point: { increment: point } },
      });
      console.log(newTransactionStatus);
      console.log("complete");
      return newTransactionStatus;
    });
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = { completeTransaction };
