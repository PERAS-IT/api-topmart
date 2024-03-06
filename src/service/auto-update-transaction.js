const { TransactionStatus } = require("@prisma/client");
const repo = require("../repository");

exports.expireTransaction = async () => {
  try {
    console.log("first");
    const threeDayAgo = new Date();
    threeDayAgo.setDate(threeDayAgo.getDate() - 3);
    const expireTransaction = await repo.transaction.findExpireTransaction(
      threeDayAgo
    );
    if (expireTransaction.length === 0) return;
    await Promise.all(
      expireTransaction.map(async (transaction) => {
        return repo.transaction.updateTransaction(
          { status: TransactionStatus.FAIL },
          transaction.id
        );
      })
    );

    // await promise.all(expireTransaction.map(async(transaction)=>{
    //   return repo.itemPayment
    // })
  } catch (err) {
    console.log(err);
  }
};
