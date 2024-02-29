const { CustomError } = require("../config/error");

exports.checkPermission =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.roles))
      throw new CustomError("Forbidden", "Forbidden", 403);
    next();
  };
