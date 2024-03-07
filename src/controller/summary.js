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
      const date = transition.createdAt.toISOString().split("T")[0];
      if (!summary[date]) {
        const itemPayment =
          await repo.itemPayment.getAllItemPaymentByTransactionId(
            transition.id
          );
        summary[date] = { totalSale: 0 };
        for (sale of itemPayment) {
          summary[date].totalSale += sale.price * sale.quantity;
        }
      }
    }
    const dates = Object.keys(summary);
    const totalSales = Object.values(summary).map((item) => item.totalSale);

    const result = {
      date: dates,
      totalSale: totalSales,
    };

    const totalSaleBySerie =
      await repo.summary.getTotalSaleBySerieInThirtyDay();

    const totalSaleBySerieInThirtyDay = {
      serieId: totalSaleBySerie.map((item) => item.serieId),
      serieName: totalSaleBySerie.map((item) => item.serieName),
      totalSales: totalSaleBySerie.map((item) => item.totalSales),
    };

    const totalSaleByProduct =
      await repo.summary.getTotalSaleByProductNameInThirtyDay();

    const totalSaleByNameInThirtyDay = {
      productId: totalSaleByProduct.map((item) => item.productId),
      productName: totalSaleByProduct.map((item) => item.productName),
      totalSales: totalSaleByProduct.map((item) => item.totalSale),
    };

    res
      .status(200)
      .json({
        totalSaleBydate: result,
        totalSaleBySerieInThirtyDay,
        totalSaleByNameInThirtyDay,
      });
  } catch (err) {
    next(err);
  }
  return;
};
