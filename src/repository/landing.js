const prisma = require("../config/prisma");

module.exports.createLandingPage = async (data) =>
  await prisma.landingImage.create({ data });

module.exports.deleteLandingPageById = async (imageIdArray) =>
  await prisma.landingImage.deleteMany({
    where: {
      id: {
        in: imageIdArray,
      },
    },
  });
