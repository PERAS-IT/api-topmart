const { CustomError } = require("../config/error");

exports.checkPermission =
  (...roles) =>
  (req, res, next) => {
    console.log("sec");
    if (!roles.includes(req.user.role))
      throw new CustomError("Forbidden", "Forbidden", 403);
    console.log("first");
    next();
  };
