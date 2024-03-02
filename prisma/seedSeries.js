const { PrismaClient, Role } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function seedingSeries() {
  const rawData = fs.readFileSync("prisma/data/dataSeries.json");
  console.log(rawData);
  const data = JSON.parse(rawData);

  for (const item of data) {
    await prisma.productSeries.create({
      data: item,
    });
  }
}

seedingSeries()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
