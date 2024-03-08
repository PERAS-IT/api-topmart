const repo = require("../repository");

exports.updateTagProduct = async () => {
  try {
    const thirtyDayAgo = new Date();
    thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30);
    thirtyDayAgo.setHours(0, 0, 0, 0);

    await repo.auto.updateNotHotProduct(thirtyDayAgo);
    const hotProduct = await repo.summary.getAllHotProduct();
    const hotId = hotProduct.map((item) => item.productId);
    await repo.summary.updateAllHotProduct(hotId);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
