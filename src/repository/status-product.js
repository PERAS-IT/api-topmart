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
