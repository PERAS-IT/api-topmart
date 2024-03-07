const prisma = require("../config/prisma");

module.exports.getAllLanding = async () => await prisma.landingImage.findMany();
module.exports.createLandingPage = async (data) =>
  await prisma.landingImage.create({ data });

module.exports.deleteLandingById = async (landingId) =>
  await prisma.landingImage.delete({ where: { id: landingId } });

module.exports.deleteLandingMultiById = async (imageIdArray) =>
  await prisma.landingImage.deleteMany({
    where: {
      id: {
        in: imageIdArray,
      },
    },
  });
