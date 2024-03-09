const repo = require("../repository");

exports.updateTagProduct = async () => {
  try {
    // const thirtyDayAgo = new Date();
    // thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30);
    // thirtyDayAgo.setHours(0, 0, 0, 0);
    // const sevenDayAgo = new Date();
    // sevenDayAgo.setDate(sevenDayAgo.getDate() - 7);
    // sevenDayAgo.setHours(0, 0, 0, 0);

    await repo.auto.updateNotHotProduct();
    const hotProduct = await repo.auto.getAllHotProduct();
    const hotId = hotProduct.map((item) => item.productId);
    await repo.auto.updateAllHotProduct(hotId);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
