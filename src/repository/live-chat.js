const prisma = require("../config/prisma");

module.exports.getHistoryChat = async (userId) =>
  await prisma.liveChat.findMany({ where: {} });
