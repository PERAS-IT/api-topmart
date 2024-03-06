const prisma = require("../config/prisma");

module.exports.getWatchList = async (userId) =>
  await prisma.watchList.findMany({
    where: { userId },
    include: {
      products: {
        include: {
          productCover: true,
        },
      },
    },
  });

module.exports.createWatchList = async (userId, productId) =>
  await prisma.watchList.create({
    data: {
      userId,
      productId,
    },
  });

module.exports.deleteWatchList = async (watchListId) =>
  await prisma.watchList.delete({ where: { id: watchListId } });

module.exports.searchDuplicate = async (userId, productId) =>
  await prisma.watchList.findFirst({ where: { userId, productId } });
