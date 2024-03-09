//=====================================================Imported Zone
const express = require("express");
const { json, urlencoded } = require("express");
const cors = require("cors");
const morgan = require("morgan");

//=====================================================local consted Zone

const { notFound } = require("../middlewares/notFound");
const { errorMiddlewares } = require("../middlewares/error");
const CustomError = require("../config/error");
const userRoute = require("../router/user");
const productRoute = require("../router/product");
const landingRoute = require("../router/landing");
const adminRoute = require("../router/admin");
const { scheduleDatabaseUpdate } = require("../utils/cron");
const cartRoute = require("../router/cart");
const transactionRoute = require("../router/transaction");
const rewardRoute = require("../router/reward");
const watchListRoute = require("../router/watchList");
const statusProductRoute = require("../router/status-product");
const { expireTransaction } = require("../service/auto-update-transaction");
const { updateStatusProduct } = require("../service/auto-update-product");
const summaryRoute = require("../router/summary");
const liveChatRoute = require("../router/live-chat");
const getProductRoute = require("../router/get-product");
const { updateTagProduct } = require("../service/auto-update-tagproduct");

//=====================================================Server Zone
module.exports = function restApiServer(app) {
  //=====================================================Encoding Zone
  app.use(morgan("dev"));
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(express.static("public"));

  //=====================================================Routing Zone
  app.use("/ping", (req, res, next) => {
    try {
      console.log("Checking the API status: Everything is OK");
      res.status(200).json("pong");
    } catch (error) {
      next(new CustomError("Ping Error", "NotFoundData", 500));
    }
  });
  app.use("/user", userRoute);
  app.use("/product", productRoute);
  app.use("/admin", adminRoute);
  app.use("/landing", landingRoute);
  app.use("/cart", cartRoute);
  app.use("/transaction", transactionRoute);
  app.use("/reward", rewardRoute);
  app.use("/watch", watchListRoute);
  app.use("/status_product", statusProductRoute);
  app.use("/summary", summaryRoute);
  app.use("/show-product", getProductRoute);
  app.use("/live-chat", liveChatRoute);

  scheduleDatabaseUpdate("*/15 * * * *", expireTransaction);
  scheduleDatabaseUpdate("0 0 * * * * *", updateTagProduct);
  // scheduleDatabaseUpdate("0 0 * * * *", updateStatusProduct);
  //=====================================================Throwing Zone
  app.use(notFound);
  app.use(errorMiddlewares);
};
