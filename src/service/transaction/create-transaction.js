const { CustomError } = require("../../config/error");
const prisma = require("../../config/prisma");

const createTransactionWithItemPayment = async (
  userId,
  body,
  cartItemId,
  point
) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // DECEASE reward
      if (point >= 0) {
        await prisma.reward.update({ where: { userId }, data: { point } });
      }
      // CREATE transaction
      body.userId = userId;
      const newTransaction = await prisma.transaction.create({
        data: body,
      });
      // change cartItemId to arr [2,4]
      const itemId = cartItemId.map((el) => Number(el));
      console.log(itemId);
      // FIND cartItem data by cartItemId
      if (itemId.length === 0)
        throw new CustomError("invalid cartItemId", "WRONG_INPUT", 400);
      const itemData = await prisma.cartItems.findMany({
        where: { id: { in: itemId } },
        select: { quantity: true, price: true, productId: true },
      });
      console.log(itemData);
      if (itemData.length === 0)
        throw new CustomError("invalid cartItemId", "WRONG_INPUT", 400);
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

      return { newTransaction, itemPayment };
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { createTransactionWithItemPayment };
