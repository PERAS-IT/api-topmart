const { CustomError } = require("../config/error");
const prisma = require("../config/prisma");
const repo = require("../repository");

// USER CREATE TRANSACTION
// module.exports.createTransaction = async (req, res, next) => {
//   try {
//     // FIND transaction
//     const transaction = await repo.transaction.getTransactionByUserId(
//       req.user.id
//     );
//     if (transaction)
//       throw new CustomError("user already has transaction", "WRONG_INPUT", 400);
//     // CREATE transaction use $transaction
//     await prisma.$transaction(async () => {
//       req.body.userId = req.user.id;
//       const newTransaction = await repo.transaction.createTransaction(req.body);
//       // change cartItemId to arr [2,4]
//       const itemId = req.cartItemId.split(",").map((el) => Number(el));
//       // FIND cartItem data by cartItemId
//       const itemData = await repo.cart.getCartItemByCartItemId(itemId);
//       for (data of itemData) {
//         data.transactionId = newTransaction.id;
//       }
//       // CHECK stockQuantity
//       for (i = 0; i < itemId.length; i++) {
//         const productData = await repo.itemPayment.getProductById(
//           itemId[i].productId
//         );
//         if (productData.stockQuantity < itemData[i].quantity)
//           throw new CustomError("not enough of product", "WRONG_INPUT", 400);
//       }
//       // DELETE cartItem user choose from cart
//       await repo.cart.deleteAllCartItemById(itemId);
//       // CREATE itemPayment
//       await repo.itemPayment.createItemPayment(itemData);
//       // Find itemPayment by transactionId
//       const itemPayment =
//         await repo.itemPayment.getAllItemPaymentByTransactionId(
//           newTransaction.id
//         );
//       // UPDATE stockQuantity
//       const productUpdate = itemData.map(
//         async (item) => await repo.itemPayment.deceaseStock(item)
//       );
//       await Promise.all(productUpdate);
//       res.status(201).json({ transaction: newTransaction, itemPayment });
//     });
//   } catch (err) {
//     next(err);
//   }
//   return;
// };

module.exports.createTransaction = async (req, res, next) => {
  try {
    await prisma.$transaction(async (prisma) => {
      // FIND transaction
      const transaction = await repo.transaction.getTransactionPendingByUserId(
        req.user.id
      );
      if (transaction)
        throw new CustomError(
          "user already has transaction",
          "WRONG_INPUT",
          400
        );
      // CHECK reward
      if (req.body.reward) {
        const reward = await repo.reward.getReward(req.user.id);
        if (!reward)
          throw new CustomError("reward not found", "WRONG_INPUT", 400);
        const rewardData = reward.point - req.body.reward;
        await repo.reward.updateReward({ point: rewardData }, req.user.id);
        delete req.body.reward;
      }
      // CREATE transaction
      req.body.userId = req.user.id;
      const newTransaction = await prisma.transaction.create({
        data: req.body,
      });
      // change cartItemId to arr [2,4]
      const itemId = req.cartItemId.split(",").map((el) => Number(el));
      // FIND cartItem data by cartItemId
      const itemData = await prisma.cartItems.findMany({
        where: { id: { in: itemId } },
        select: { quantity: true, price: true, productId: true },
      });
      for (data of itemData) {
        data.transactionId = newTransaction.id;
      }
      // CHECK stockQuantity
      for (i = 0; i < itemId.length; i++) {
        const productData = await prisma.products.findFirst({
          where: { id: itemData[i]?.productId },
        });
        if (productData.stockQuantity < itemData[i]?.quantity)
          throw new CustomError("not enough of product", "WRONG_INPUT", 400);
      }
      // DELETE cartItem user choose from cart
      await prisma.cartItems.deleteMany({ where: { id: { in: itemId } } });
      // CREATE itemPayment
      await prisma.itemPayment.createMany({ data: itemData });
      // Find itemPayment by transactionId
      const itemPayment = await prisma.itemPayment.findMany({
        where: { transactionId: newTransaction.id },
      });
      // UPDATE stockQuantity
      const productUpdate = itemData.map(async (item) => {
        const updatedProduct = await prisma.products.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });

        // Check if stockQuantity is 0, then set isSoldOut to true
        if (updatedProduct.stockQuantity === 0) {
          await prisma.products.update({
            where: { id: item.productId },
            data: {
              isSoldOut: true,
            },
          });
        }
      });

      await Promise.all(productUpdate);

      res.status(201).json({ transaction: newTransaction, itemPayment });
    });
  } catch (err) {
    next(err);
  }
  return;
};

// USER UPDATE TRANSACTION
module.exports.updateTransaction = async (req, res, next) => {
  try {
    const transactionId = req.transactionId;
    const transaction = await repo.transaction.getTransactionPendingByUserId(
      req.user.id
    );
    if (!transaction)
      throw new CustomError("transaction not found", "WRONG_INPUT", 400);
    req.body.paymentedAt = new Date();
    const newStatus = await repo.transaction.updateTransaction(
      req.body,
      transactionId
    );
    await repo.itemPayment.updateAllItemPaymentByTransactioonId(
      transactionId,
      "COMPLETE"
    );
    res.status(200).json({ transaction: newStatus });
  } catch (err) {
    next(err);
  }
  return;
};

// USER GET TRANSACTION
module.exports.getTransactionByUserId = async (req, res, next) => {
  try {
    const transaction = await repo.transaction.getAllTransactionByUserId(
      req.user.id
    );
    res.status(200).json({ transaction });
  } catch (err) {
    next(err);
  }
  return;
};

// for backend only use to test
module.exports.deleteTransaction = async (req, res, next) => {
  try {
    console.log(req.transactionId);
    await repo.transaction.deleteTransaction(req.transactionId);
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
  return;
};
