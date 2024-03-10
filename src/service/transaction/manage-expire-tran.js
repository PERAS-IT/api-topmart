const { TransactionStatus, PaymentStatus } = require("@prisma/client");
const prisma = require("../../config/prisma");

const manageExpireTransaction = async (expireTransaction) => {
  try {
    await prisma.$transaction(async (prisma) => {
      await Promise.all(
        expireTransaction.map(async (transaction) =>
          prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: TransactionStatus.FAIL },
          })
        )
      );
      await Promise.all(
        expireTransaction.map(async (transaction) => {
          const data = await prisma.itemPayment.findMany({
            where: { transactionId: transaction.id },
          });
          await Promise.all(
            data.map(async (item) =>
              prisma.itemPayment.updateMany({
                where: { transactionId: item.transactionId },
                data: { payStatus: PaymentStatus.FAIL },
              })
            )
          );
          await Promise.all(
            data.map(async (product) =>
              prisma.products.update({
                where: { id: product.productId },
                data: {
                  stockQuantity: { increment: product.quantity },
                  isSoldOut: false,
                },
              })
            )
          );
        })
      );
      await Promise.all(
        expireTransaction.map(async (transaction) => {
          const point = transaction.discount * 100 || 0;
          await prisma.reward.update({
            where: { userId: transaction.userId },
            data: { point: { increment: point } },
          });
        })
      );
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = { manageExpireTransaction };
