const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

async function seeding() {
  await prisma.user.create({
    data: {
      email: "superadmin@gmail.com",
      password: "123456",
      role: Role.SUPERADMIN,
    },
  });
}
seeding();
