const prisma = require("../config/prisma");

// สร้าง itemPayment
module.exports.createItemPayment = async (data) =>
  await prisma.itemPayment.createMany({ data });
