const repo = require("../repository");
const { manageExpireTransaction } = require("./transaction/manage-expire-tran");

exports.expireTransaction = async () => {
  try {
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);
    const expireTransaction = await repo.transaction.findExpireTransaction(
      fifteenMinutesAgo
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
