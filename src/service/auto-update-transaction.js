const repo = require("../repository");
const { manageExpireTransaction } = require("./transaction/manage-expire-tran");

exports.expireTransaction = async () => {
  try {
    const threeDayAgo = new Date();
    threeDayAgo.setDate(threeDayAgo.getDate() - 3);
    threeDayAgo.setHours(0, 0, 0, 0);
    const expireTransaction = await repo.transaction.findExpireTransaction(
      threeDayAgo
    );
    console.log(expireTransaction);
    if (expireTransaction.length === 0) return;
    // UPDATE transaction to fail use $transaction
    await manageExpireTransaction(expireTransaction);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
