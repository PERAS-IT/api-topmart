const prisma = require("../config/prisma");

module.exports.getProductBySeriesId = async (id) =>
  await prisma.productSeries.findMany({
    where: { id },
    include: { product: { include: { productCover: true } } },
  });

module.exports.getProductByGroupName = async (groupName) =>
  await prisma.productGroup.findMany({
    where: { group: groupName },
    include: { products: { include: { productCover: true } } },
  });

module.exports.getProductByCategoriesId = async (categoriesId) =>
  await prisma.productGroup.findMany({
    where: { id: categoriesId },
    include: { products: { include: { productCover: true } } },
  });
