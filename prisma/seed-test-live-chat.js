const { PrismaClient, Role } = require("@prisma/client");
const fs = require("fs");
const { userId } = require("../src/middlewares/validators");
const prisma = new PrismaClient();

async function seedingLive() {
  const rawData = fs.readFileSync("prisma/data/dataLiveChat.json");
  console.log(rawData);
  const data = JSON.parse(rawData);

  const hour = "test";
  const minute = "test";
  for (const item of data) {
    await new Promise((resolve) => {
      setTimeout(resolve, 5000); // 5000 milliseconds = 5 seconds
    });
    await prisma.liveChat.create({
      data: {
        message: item.message,
        userId: item.userId,
        userName: item.userName,
        hour: hour,
        minute: minute,
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
