const repo = require("../repository");

module.exports.getSummary = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const transactionInthirtyDay = await repo.summary.getThirtyDayTran(
      thirtyDaysAgo,
      tomorrow
    );
    const summary = {};
    for (transition of transactionInthirtyDay) {
      // console.log(transition.createdAt);
      const date = transition.createdAt.toISOString().split("T")[0];
      if (!summary[date]) {
        const itemPayment =
          await repo.itemPayment.getAllItemPaymentByTransactionId(
            transition.id
          );
        summary[date] = { totalSale: 0 };
        for (sale of itemPayment) {
          console.log("first");
          console.log(sale);
          console.log(summary[date].totalSale, sale.price);
          summary[date].totalSale += sale.price * sale.quantity;
        }
        console.log(itemPayment);
      }
    }
    console.log(summary);
    res.status(200).json({ summary });
  } catch (err) {
    next(err);
  }
  return;
};
