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
// admin,superAdmin see all user
adminRoute.get(
  "/allUser",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  c.admin.getAllUser
);
// super admin see all admin
adminRoute.get(
  "/allAdmin",
  authenticate,
  checkPermission(Role.SUPERADMIN),
  c.admin.getAllAdmin
);
// superadmin or admin ban user
adminRoute.patch(
  "/:userId/banned/user",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  validateUserId,
  c.admin.bannedUser
);
// superadmin or admin unban user
adminRoute.patch(
  "/:userId/unBanned/user",
  authenticate,
  checkPermission(Role.ADMIN, Role.SUPERADMIN),
  validateUserId,
  c.admin.unbannedUser
);
// superadmin ban admin
adminRoute.patch(
  "/:userId/banned/admin",
  authenticate,
  checkPermission(Role.SUPERADMIN),
  validateUserId,
  c.admin.bannedBySuperAdmin
);
// superadmin unban admin
adminRoute.patch(
  "/:userId/unBanned/admin",
  authenticate,
  checkPermission(Role.SUPERADMIN),
  validateUserId,
  c.admin.unbannedBySuperAdmin
);

module.exports = adminRoute;
