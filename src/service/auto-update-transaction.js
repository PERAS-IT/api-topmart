const { TransactionStatus } = require("@prisma/client");
const repo = require("../repository");

exports.expireTransaction = async () => {
  try {
    const threeDayAgo = new Date();
    threeDayAgo.setDate(threeDayAgo.getDate() - 3);
    const expireTransaction = await repo.transaction.findExpireTransaction(
      threeDayAgo
    );
    console.log(expireTransaction);
    if (expireTransaction.length === 0) return;
    await Promise.all(
      expireTransaction.map(async (transaction) => {
        return repo.transaction.updateTransaction(
          { status: TransactionStatus.FAIL },
          transaction.id
        );
      })
    );

    await Promise.all(
      expireTransaction.map(async (transaction) => {
        const data = await repo.itemPayment.getAllItemPaymentByTransactionId(
          transaction.id
        );
        await Promise.all(
          data.map(async (product) => {
            await repo.itemPayment.updateAllItemPaymentByTransactioonId(
              product.transactionId,
              TransactionStatus.FAIL
            );
            await repo.itemPayment.updateProductStockByExpireTran(
              product.productId,
              product.quantity
            );
          })
        );
      })
    );
  } catch (err) {
    console.log(err);
  }
};
