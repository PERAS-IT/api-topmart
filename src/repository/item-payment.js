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
