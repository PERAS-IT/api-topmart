const prisma = require("../config/prisma");

//table Series

module.exports.findSeries = async (series) =>
  await prisma.productSeries.findFirst({
    where: {
      series,
    },
  });

module.exports.createProductSeries = async (data) =>
  await prisma.productSeries.create({ data });

module.exports.editProductSeries = async (idSeries, nameSeries) =>
  await prisma.productSeries.update({
    where: {
      id: idSeries,
    },
    data: {
      series: nameSeries,
    },
  });

//table class

module.exports.findProductGroupByCategory = async (categories) =>
  await prisma.productClass.findFirst({
    where: {
      categories,
    },
  });

module.exports.createProductGroup = async (data) =>
  await prisma.productClass.create({ data });

module.exports.editProductGroup = async (idGroup, data) => {
  await prisma.productClass.update({
    where: {
      id: idGroup,
    },
    data,
  });
};

// table product
module.exports.createProduct = async (data) =>
  await prisma.products.create({ data });

module.exports.createProductImage = async (data) =>
  await prisma.productImages.create({ data });

module.exports.createProductPoster = async (data) =>
  await prisma.productPoster.create({ data });

module.exports.getAllProduct = async () =>
  await prisma.products.findMany({
    include: {
      productSeries,
      productClass,
      productImages,
      productPosters,
    },
  });

module.exports.getProductById = async (idProduct) =>
  await prisma.product.findUnique({
    where: {
      id: idProduct,
    },
    include: {
      productSeries,
      productImage,
      productPoster,
      productClass,
    },
  });

//Image
exports.createImageProduct = (data) => prisma.productImages.create({ data });
exports.createImagePoster = (data) => prisma.productPosters.create({ data });
