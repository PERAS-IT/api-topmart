const prisma = require("../config/prisma");

module.exports.createProductSeries = async (nameSeries) =>
  await prisma.productSeries.create({ nameSeries });

module.exports.createProductClass = async (data) =>
  await prisma.productClass.create({ data });

module.exports.createProduct = async (data) =>
  await prisma.products.create({ data });
