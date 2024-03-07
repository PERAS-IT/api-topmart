const { TransactionStatus, PaymentStatus } = require("@prisma/client");
const prisma = require("../../config/prisma");

const completeTransaction = async (id) => {
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
    return { newTransactionStatus };
  });
  return result;
};

module.exports = { completeTransaction };
