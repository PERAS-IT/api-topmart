const prisma = require("../config/prisma");

module.exports.getNewArrival = async () =>
  await prisma.products.findMany({
    where: { isNew: true },
    include: { productCover: true },
  });
