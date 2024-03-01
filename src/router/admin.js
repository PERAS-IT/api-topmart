const { Router } = require("express");

const c = require("../controller");
const authenticate = require("../middlewares/authenticate");
const checkPermission = require("../middlewares/checkPermission");
const {
  validateLogin,
  validateRegister,
} = require("../middlewares/validators/validate-auth");
const { Role } = require("@prisma/client");
const { validateUserId } = require("../middlewares/validators/validate-userId");

const adminRoute = Router();

adminRoute.post(
  "/register",
  authenticate,
  checkPermission(Role.SUPERADMIN),
  validateRegister,
  c.admin.register
);

adminRoute.get(
  "/allUser",
  authenticate,
  checkPermission(Role.ADMIN),
  c.admin.getAllUser
);

adminRoute.get(
  "/allAdmin",
  authenticate,
  checkPermission(Role.SUPERADMIN, c.admin.getAllAdmin)
);

adminRoute.patch(
  "/:userId/banned/user",
  authenticate,
  checkPermission(Role.ADMIN),
  validateUserId,
  c.admin.bannedUser
);

adminRoute.patch(
  "/:userId/unbanned/user",
  authenticate,
  checkPermission(Role.ADMIN),
  validateUserId,
  c.admin.unbannedUser
);

adminRoute.patch(
  "/:userId/banned/admin",
  authenticate,
  checkPermission(Role.SUPERADMIN),
  validateUserId,
  c.admin.bannedAdmin
);
