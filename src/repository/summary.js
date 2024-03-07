const { TransactionStatus } = require("@prisma/client");
const prisma = require("../config/prisma");

module.exports.getThirtyDayTran = async (thirty, tomorrow) =>
  await prisma.transaction.findMany({
    where: {
      createdAt: { gte: thirty, lte: tomorrow },
      // status: TransactionStatus.COMPLETE,
    },
  });

module.exports.getThirtyDayTranWithProductSerie = async (thirty, tomorrow) =>
  await prisma.transaction.findMany({
    where: { createdAt: { gte: thirty, lte: tomorrow } },
    include: {
      itemPayments: {
        include: { Products: { select: { productSeries: true } } },
      },
    },
  });

// module.exports.getTotalSaleBySerieInThirtyDay = async () => {
//   const rawQuery = `
//     SELECT
//        ps.id serieId, ps.series serieName, SUM(i.quantity) totalSales
//     FROM
//         transactions t
//             JOIN
//         item_payments i ON t.id = i.transaction_id
//             JOIN
//         products p ON i.product_id = p.id
//             JOIN
//         product_series ps ON p.serie_id = ps.id
//     WHERE t.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
//     AND t.created_at <= CURDATE()
//     GROUP BY serieName;
//   `;

//   const salesBySeries = await prisma.$queryRaw(rawQuery);
//   return salesBySeries;
// };

module.exports.getTotalSaleBySerieInThirtyDay = async () => {
  const salesBySeries = await prisma.$queryRaw`SELECT 
       ps.id serieId, ps.series serieName, SUM(i.quantity) totalSales
    FROM
        transactions t
            JOIN
        item_payments i ON t.id = i.transaction_id
            JOIN
        products p ON i.product_id = p.id
            JOIN
        product_series ps ON p.serie_id = ps.id
    WHERE t.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    AND t.created_at <= CURDATE()
    GROUP BY serieName
    order by totalSales desc;`;
  return salesBySeries;
};

module.exports.getTotalSaleByProductNameInThirtyDay = async () => {
  const salesByName = await prisma.$queryRaw`SELECT 
    p.product_name productName,sum(i.quantity) totalSales, p.id productId
FROM
    transactions t
        JOIN
    item_payments i ON t.id = i.transaction_id
        JOIN
    products p ON i.product_id = p.id
WHERE
    t.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        AND t.created_at <= CURDATE()
GROUP BY p.product_name
order by totalSales desc;`;
  return salesByName;
};
