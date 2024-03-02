const prisma = require("../config/prisma");

//table Series

module.exports.getAllSeries = async () => {
  return await prisma.productSeries.findMany();
};
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

//table Group

module.exports.getAllGroup = async () => {
  return await prisma.productGroup.findMany();
};

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

//*****************************
// table product
module.exports.createProduct = async (data) =>
  await prisma.products.create({ data });

module.exports.getAllProduct = async () =>
  await prisma.products.findMany({
    include: {
      productSeries,
      productGroup,
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
