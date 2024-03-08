const prisma = require("../config/prisma");

module.exports.getHistoryChat = async (userId) =>
  await prisma.liveChat.findMany({ where: { userId: userId } });

module.exports.saveMessageChat = async (data) =>
  await prisma.liveChat.create({ data });
