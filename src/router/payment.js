const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const { Role } = require("@prisma/client");
const v = require("../middlewares/validators");
const c = require("../controller");

const paymentRoute = express.Router();

paymentRoute.post(
  "/:transactionId",
  authenticate,
  checkPermission(Role.USER),
  v.transactionId.validateTransactionId,
  c.payment.createPayment
);

module.exports = paymentRoute;
