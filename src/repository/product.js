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
  return await prisma.productGroup.update({
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
module.exports.updateQuantity = async (id, quantity) =>
  await prisma.products.update({
    where: { id },
    data: { stockQuantity: quantity },
  });
module.exports.getAllProduct = async () =>
  await prisma.products.findMany({
    include: {
      productSeries: true,
      productGroup: true,
      productCover: true,
      productImages: true,
      productPosters: true,
    },
  });
module.exports.getProductById = async (idProduct) =>
  await prisma.products.findFirst({
    where: {
      id: idProduct,
    },
    include: {
      productCover: true,
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

//=======================================Cover=====
//cover image

module.exports.deleteCover = async (id) =>
  await prisma.productCover.update({ where: { id }, data: { cover: null } });
module.exports.createCover = async (productsId, cover) =>
  await prisma.productCover.create({
    data: {
      productsId,
      cover,
    },
  });
module.exports.updateCover = async (id, coverURL) =>
  await prisma.productCover.update({
    where: {
      id: id,
    },
    data: {
      cover: coverURL,
    },
  });

module.exports.searchCoverByCoverId = async (id) =>
  await prisma.productCover.findFirst({ where: { id } });

//=======================================IMAGE=====
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

//=======================================Poster=====
exports.createPoster = async (data) =>
  await prisma.productPosters.create({ data });
exports.searchPosterByProductId = async (productId) =>
  await prisma.productPosters.findMany({ where: { productId } });
exports.updatePoster1ByPostId = async (id, newPoster) =>
  await prisma.productPosters.update({
    where: {
      id,
    },
    data: {
      posters1: newPoster,
    },
  });
exports.updatePoster2ByPostId = async (id, newPoster) =>
  await prisma.productPosters.update({
    where: {
      id,
    },
    data: {
      posters2: newPoster,
    },
  });
exports.updatePoster3ByPostId = async (id, newPoster) =>
  await prisma.productPosters.update({
    where: {
      id,
    },
    data: {
      posters3: newPoster,
    },
  });
exports.updatePoster4ByPostId = async (id, newPoster) =>
  await prisma.productPosters.update({
    where: {
      id,
    },
    data: {
      posters4: newPoster,
    },
  });
exports.updatePoster5ByPostId = async (id, newPoster) =>
  await prisma.productPosters.update({
    where: {
      id,
    },
    data: {
      posters5: newPoster,
    },
  });

exports.deletePoster1ByPosterId = async (id) =>
  await prisma.productPosters.update({
    where: { id },
    data: { posters1: null },
  });
exports.deletePoster2ByPosterId = async (id) =>
  await prisma.productPosters.update({
    where: { id },
    data: { posters2: null },
  });
exports.deletePoster3ByPosterId = async (id) =>
  await prisma.productPosters.update({
    where: { id },
    data: { posters3: null },
  });
exports.deletePoster4ByPosterId = async (id) =>
  await prisma.productPosters.update({
    where: { id },
    data: { posters4: null },
  });
exports.deletePoster5ByPosterId = async (id) =>
  await prisma.productPosters.update({
    where: { id },
    data: { posters5: null },
  });

exports.searchPoster1ByPosterId = async (id) =>
  await prisma.productPosters.findFirst({
    where: { id },
    select: { posters1: true },
  });

exports.searchPoster2ByPosterId = async (id) =>
  await prisma.productPosters.findFirst({
    where: { id },
    select: { posters2: true },
  });
exports.searchPoster3ByPosterId = async (id) =>
  await prisma.productPosters.findFirst({
    where: { id },
    select: { posters3: true },
  });
exports.searchPoster4ByPosterId = async (id) =>
  await prisma.productPosters.findFirst({
    where: { id },
    select: { posters4: true },
  });
exports.searchPoster5ByPosterId = async (id) =>
  await prisma.productPosters.findFirst({
    where: { id },
    select: { posters5: true },
  });

//========================================NEW ARRIVAL====
