const repo = require("../repository");

module.exports.updateStatusProduct = async () => {
  try {
    const resultSearch = await repo.statusProduct.searchProductBySevenDayAgo();
    const convertToArray = resultSearch.map((product) => product.id);
    console.log(convertToArray);
    const updateStatus = await repo.statusProduct.updateProductToNotNewProduct(
      convertToArray
    );
    console.log(updateStatus);
  } catch (err) {
    console.log(err);
  }
};
