const prisma = require("../config/prisma");

module.exports.getAllHotProduct = async () => {
  const allHot = await prisma.$queryRaw`SELECT 
    p.id productId
FROM
    transactions t
        JOIN
    item_payments i ON t.id = i.transaction_id
        JOIN
    products p ON i.product_id = p.id
WHERE
    t.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        AND t.created_at <= CURDATE() and t.status = "COMPLETE"
GROUP BY p.product_name
order by totalSales desc
limit 20;`;
  return allHot;
};

module.exports.updateNotHotProduct = async () =>
  prisma.products.updateMany({
    where: { isHot: true },
    data: { isHot: false },
  });

module.exports.updateAllHotProduct = async (id) =>
  prisma.products.updateMany({
    where: { id: { in: id } },
    data: { isHot: true },
  });

module.exports.updateNotNewProduct = async (thirtyDayAgo) =>
  await prisma.products.updateMany({
    where: { launchDate: { lte: thirtyDayAgo } },
    data: { isNew: false },
  });
