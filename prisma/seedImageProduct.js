const { PrismaClient, Role } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function seedingImagesProduct() {
  const rawData = fs.readFileSync("prisma/data/imageProduct.json");
  console.log(rawData);
  const data = JSON.parse(rawData);

  for (const item of data) {
    await prisma.productImages.create({
      data: item,
    });
  }
}

seedingImagesProduct()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
