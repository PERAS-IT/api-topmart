const prisma = require("../config/prisma");

// สร้าง itemPayment
module.exports.createItemPayment = async (data) => {
  const item = await prisma.itemPayment.createMany({ data });
  return item;
};
// นำ itempayment ไปหัก Stock
module.exports.deceaseStock = async (itemPayment) =>
  await prisma.products.update({
    where: { id: itemPayment.productId },
    data: { stockQuantity: { decrement: itemPayment.quantity } },
  });
// หา itemPayment ทั้งหมดจาก transactionId
module.exports.getAllItemPaymentByTransactionId = async (transactionId) =>
  await prisma.itemPayment.findMany({ where: { transactionId } });
// ลบ itemPayment ไม่มีเชื่อมต่อไปหน้าบ้าน
module.exports.deleteItemPayment = async (id) =>
  await prisma.itemPayment.delete({ where: { id } });
// หา topten itempayment
module.exports.getToptenItemPayment = async (sevenDayAgo) =>
  await prisma.itemPayment.groupBy({
    by: ["productsId"],
    _sum: { totalSale: { _mu1: { price: true, quantity: true } } },
    where: { transaction: { createAt: { gte: sevenDayAgo } } },
    orderBy: { _sum: "desc" },
    take: 10,
  });

// หา topten product by itemPaymentId
module.exports.getToptenProduct = async (id) =>
  await prisma.products.findMany({ where: { id: { in: id } } });
// หา product by productId
module.exports.getProductById = async (id) =>
  await prisma.products.findFirst({ where: { id } });
