const prisma = require("../config/prisma");

//=======================================SERIES======

module.exports.getAllSeries = async () => {
  return await prisma.productSeries.findMany();
};
module.exports.findSeries = async (series) =>
  await prisma.productSeries.findFirst({
    where: {
      series,
    },
  });

module.exports.findProductBySeries = async (serieId) =>
  await prisma.productSeries.findMany({
    where: {
      id: serieId,
    },
    include: {
      products: {
        include: {
          productImages,
        },
      },
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

//=======================================GROUP=======
module.exports.getAllGroup = async () => {
  return await prisma.productGroup.findMany();
};
module.exports.findGroupByCategory = async (categories) =>
  await prisma.productGroup.findFirst({ where: { categories: categories } });

module.exports.findProductGroupByCategory = async (id) =>
  await prisma.productGroup.findFirst({
    where: {
      id,
    },
    include: {
      products: {
        include: {
          productImages,
        },
      },
    },
  });

module.exports.createProductGroup = async (data) =>
  await prisma.productGroup.create({ data });

module.exports.editProductGroup = async (idGroup, data) => {
  await prisma.productGroup.update({
    where: {
      id: idGroup,
    },
    data,
  });
};

//=======================================PRODUCT=====
module.exports.findProductByName = async (name) =>
  await prisma.products.findFirst({ where: { productName: name } });
module.exports.findProductDuplicate = async (name) =>
  await prisma.products.findMany({ where: { productName: name } });
module.exports.createProduct = async (data) =>
  await prisma.products.create({ data });
module.exports.editProduct = async (id, data) =>
  await prisma.products.update({
    where: {
      id: id,
    },
    data,
  });
module.exports.getAllProduct = async () =>
  await prisma.products.findMany({
    include: {
      productSeries: true,
      productGroup: true,
      productImages: true,
    },
  });
module.exports.getProductById = async (idProduct) =>
  await prisma.products.findFirst({
    where: {
      id: idProduct,
    },
    include: {
      productSeries: true,
      productGroup: true,
      productImages: true,
      productPosters: true,
    },
  });
module.exports.deleteProductSoft = async (id) =>
  await prisma.products.update({ where: { isActive: false } });

module.exports.deleteProduct = async (id) =>
  await prisma.products.delete({ where: { id } });
//=======================================IMAGE=====
//cover image
exports.createCover = async (data) =>
  await prisma.productCover.create({ data }); // wait create table

//table imageProduct
exports.createImageProduct = async (data) =>
  await prisma.productImages.create({ data });

exports.updateImageProduct = async (id) =>
  await prisma.productImages.update({ where: { id: id } });
exports.deleteProductImageById = async (id) =>
  await prisma.productImages.delete({ where: { id: id } });
exports.deleteImageByProductId = async (productId) =>
  await prisma.productImages.deleteMany({ where: { productId: productId } });
exports.searchImagesByProductId = async (productId) =>
  await prisma.productImages.findMany({
    where: {
      productId,
    },
  });
exports.searchImageByImageId = async (imageId) =>
  await prisma.productImages.findFirst({ where: { id: imageId } });

//table posterProduct
exports.createImagePoster = async (data) =>
  await prisma.productPosters.create({ data });
exports.searchPosterByProductId = async (productId) =>
  await prisma.productPosters.findMany({ where: { productId } });
exports.updateProductPosterById = async (id) =>
  await prisma.productPosters.update({ where: { id: id } });
exports.deleteProductPosterById = async (id) =>
  await prisma.productPosters.delete({ where: { id: id } });
exports.deletePosterByProductId = async (productId) =>
  await prisma.productPosters.deleteMany({ where: { productId: productId } });

// exports.createPoster = async (data) => await prisma.p;
