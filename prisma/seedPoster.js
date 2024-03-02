const { PrismaClient, Role } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function seedingPoster() {
  const rawData = fs.readFileSync("prisma/data/posterProduct.json");
  console.log(rawData);
  const data = JSON.parse(rawData);

  for (const item of data) {
    await prisma.productPosters.create({
      data: item,
    });
  }
}

seedingPoster()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
