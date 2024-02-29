const prisma = require("../config/prisma");

module.exports.createProductSeries = async (nameSeries) =>
  await prisma.productSeries.create({ nameSeries });

module.exports.createProductClass = async (data) =>
  await prisma.productClass.create({ data });

module.exports.createProduct = async (data) =>
  await prisma.products.create({ data });

module.exports.createProductImage = async (dataImage) =>
  await prisma.productImage.create({ dataImage });

module.exports.createProductPoster = async (dataPoster) =>
  await prisma.productPoster.create({ dataPoster });

module.exports.getProductById = async (idProduct) =>
  await prisma.product.findUnique({
    where: {
      id: idProduct,
    },
    include: {
      productSerie,
      productImage,
      productPoster,
      productClass,
    },
  });
