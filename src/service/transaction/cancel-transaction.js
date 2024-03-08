const { TransactionStatus, PaymentStatus } = require("@prisma/client");
const prisma = require("../../config/prisma");

const canCelTransaction = async (id, point, userId) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // UPDATE transacation to FAIL
      const newTransactionStatus = await prisma.transaction.update({
        where: { id },
        data: { status: TransactionStatus.FAIL },
      });
      // FIND itemPayment
      const itemPayment = await prisma.itemPayment.findMany({
        where: { transactionId: id },
        select: { id: true, quantity: true, productId: true },
      });
      // UPDATE status to fail
      const newItemPaymentStatus = await Promise.all(
        itemPayment.map(async (item) =>
          prisma.itemPayment.update({
            where: { id: item.id },
            data: { payStatus: PaymentStatus.FAIL },
          })
        )
      );
      // RETUEN product to stock
      await Promise.all(
        itemPayment.map(async (item) =>
          prisma.products.update({
            where: { id: item.productId },
            data: {
              stockQuantity: { increment: item.quantity },
              isSoldOut: false,
            },
          })
        )
      );
      // RETURN reward
      await prisma.reward.update({
        where: { userId },
        data: { point: { increment: point } },
      });

      return { newTransactionStatus, newItemPaymentStatus };
    });
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = { canCelTransaction };
