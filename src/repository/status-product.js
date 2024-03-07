const prisma = require("../config/prisma");

module.exports.getNewArrival = async () =>
  await prisma.products.findMany({
    where: { isNew: true },
    include: { productCover: true },
  });

module.exports.getLaunchProductSortByDate = async () => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return await prisma.products.findMany({
    where: {
      launchDate: {
        gt: currentDate,
      },
    },
    include: { productCover: true },
    orderBy: { launchDate: "desc" },
  });
};

//=======================================UPDATE STATUS=====
exports.searchProductBySevenDayAgo = async () => {
  const currentDate = new Date();
  const dateSevenDayAgo = new Date(
    currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
  );
  return await prisma.products.findMany({
    where: {
      launchDate: {
        lt: dateSevenDayAgo,
      },
      isNew: true,
    },
    select: { id: true },
  });
};

exports.updateProductToNotNewProduct = async (arrayListIdUpdate) =>
  await prisma.products.updateMany({
    where: {
      id: {
        in: arrayListIdUpdate,
      },
    },
    data: {
      isNew: false,
    },
  });
