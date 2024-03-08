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
    console.log(transactionInthirtyDay);
    const summary = {};
    for (transaction of transactionInthirtyDay) {
      const date = transaction.createdAt.toISOString().split("T")[0];
      if (!summary[date]) {
        summary[date] = { totalSale: 0 };
        summary[date].totalSale += +transaction.totalAmount;
      } else {
        summary[date].totalSale += +transaction.totalAmount;
      }
    }
    const dates = Object.keys(summary);
    const totalSales = Object.values(summary).map((item) => item.totalSale);

    const totalSaleByDateInThirtyDay = {
      date: dates,
      totalSale: totalSales,
    };

    const totalSaleBySerie =
      await repo.summary.getTotalSaleBySerieInThirtyDay();

    console.log(totalSaleBySerie);
    const totalSaleBySerieInThirtyDay = {
      serieId: totalSaleBySerie.map((item) => item.serieId),
      serieName: totalSaleBySerie.map((item) => item.serieName),
      totalSales: totalSaleBySerie.map((item) => item.totalSales),
    };

    const totalSaleByProduct =
      await repo.summary.getTotalSaleByProductNameInThirtyDay();

    console.log(totalSaleByProduct);
    const totalSaleByNameInThirtyDay = {
      productId: totalSaleByProduct.map((item) => item.productId),
      productName: totalSaleByProduct.map((item) => item.productName),
      totalSales: totalSaleByProduct.map((item) => item.totalSales),
    };

    res.status(200).json({
      totalSaleByDateInThirtyDay,
      totalSaleBySerieInThirtyDay,
      totalSaleByNameInThirtyDay,
    });
  } catch (err) {
    next(err);
  }
  return;
};
