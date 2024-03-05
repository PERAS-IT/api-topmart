const repo = require("../repository");

exports.autoUpdate = async (req, res, next) => {
  try {
    const sevenDayAgo = new Date();
    sevenDayAgo.setDate(sevenDayAgo.getDate() - 7);
    const topTenItemPayment = await repo.itemPayment.getToptenItemPayment(
      sevenDayAgo
    );
    let productId = [];
    for (item of topTenItemPayment) {
      productId.push(item.productId);
    }
    const topTenProduct = await repo.itemPayment.getToptenProduct(productId);
    res.status(200).json({ topTenProduct });
    console.log("updating....");
  } catch (err) {}
};
