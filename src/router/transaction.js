const express = require("express");

const c = require("../controller");
const v = require("../middlewares/validators");
const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const { Role } = require("@prisma/client");

const transactionRoute = express.Router();

transactionRoute.post(
  "/",
  authenticate,
  checkPermission(Role.USER),
  c.transaction.createTransaction
);
// update transaction user
transactionRoute.patch(
  "/:transactionId",
  authenticate,
  checkPermission(Role.USER),
  v.transactionId.validateTransactionId,
  c.transaction.updateTransaction
);
// user see transaction
transactionRoute.get("/", authenticate, c.transaction.getTransactionByUserId);
// admin see all transaction
transactionRoute.get(
  "/all",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.transaction.getAllTransaction
);
// admin see all fail transaction
transactionRoute.get(
  "/all/fail",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.transaction.getAllFailTransaction
);
// admin see all complete transaction
transactionRoute.get(
  "/all/complete",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.transaction.getAllCompleteTransaction
);

module.exports = transactionRoute;
