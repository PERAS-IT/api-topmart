const prisma = require("../config/prisma");

module.exports.createReward = async (data) =>
  await prisma.reward.create({ data });
module.exports.updateReward = async (data, userId) => {
  await prisma.reward.update({ where: { userId }, data });
};
module.exports.getReward = async (userId) =>
  await prisma.reward.findFirst({ where: { userId } });
