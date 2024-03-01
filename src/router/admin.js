const { Router } = require("express");

const c = require("../controller");
const authenticate = require("../middlewares/authenticate");
const { checkPermission } = require("../middlewares/checkPermission");
const { validateRegister } = require("../middlewares/validators/validate-auth");
const { Role } = require("@prisma/client");
const { validateUserId } = require("../middlewares/validators/validate-userId");

const adminRoute = Router();

// superadmin create admin
adminRoute.post(
  "/register",
  authenticate,
  checkPermission(Role.SUPERADMIN),
  validateRegister,
  c.admin.register
);
// admin see all user
adminRoute.get(
  "/allUser",
  authenticate,
  checkPermission(Role.ADMIN),
  c.admin.getAllUser
);
// super admin see all admin
adminRoute.get(
  "/all",
  authenticate,
  checkPermission(Role.SUPERADMIN),
  c.admin.getAllAdminAndUser
);
// admin ban user
adminRoute.patch(
  "/:userId/banned/user",
  authenticate,
  checkPermission(Role.ADMIN),
  validateUserId,
  c.admin.bannedUser
);
// admin unban user
adminRoute.patch(
  "/:userId/unbanned/user",
  authenticate,
  checkPermission(Role.ADMIN),
  validateUserId,
  c.admin.unbannedUser
);
// superadmin ban admin
adminRoute.patch(
  "/:userId/banned/admin",
  authenticate,
  checkPermission(Role.SUPERADMIN),
  validateUserId,
  c.admin.bannedAdmin
);

module.exports = adminRoute;
