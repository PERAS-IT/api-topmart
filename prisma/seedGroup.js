const { PrismaClient, Role } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function seedingGroup() {
  const rawData = fs.readFileSync("prisma/data.json");
  console.log(rawData);
  const data = JSON.parse(rawData);

  for (const item of data) {
    await prisma.productGroup.create({
      data: item,
    });
  }
}

seedingGroup()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
