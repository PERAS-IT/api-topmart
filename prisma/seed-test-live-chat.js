const { PrismaClient, Role } = require("@prisma/client");
const fs = require("fs");
const { userId } = require("../src/middlewares/validators");
const prisma = new PrismaClient();

async function seedingLive() {
  const rawData = fs.readFileSync("prisma/data/dataLiveChat.json");
  console.log(rawData);
  const data = JSON.parse(rawData);

  for (const item of data) {
    await prisma.productGroup.create({
      data: {
        message: item.message,
        userId: item.userId,
        userName: item.userName,
        hour: new Date(Date.now()).getHours,
        minute: new Date(Date.now()).getMinutes,
        role: item.role,
      },
    });
  }
}

seedingLive()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
