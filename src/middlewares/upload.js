const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { CustomError } = require("../config/error");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "imageProduct") {
      cb(null, "public/images/product");
    } else if (file.fieldname === "imagePoster") {
      cb(null, "public/images/poster");
    } else {
      throw new CustomError("invalid file name", "WRONG_INPUT", 400);
    }
  },
  filename: (req, file, cb) => {
    const fileName = uuidv4() + "." + file.mimetype.split("/")[1];
    cb(null, fileName);
  },
});

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
    console.log(req.files);
  },
}).fields([
  {
    name: "imageProduct",
    maxCount: 5,
  },
  {
    name: "imagePoster",
    maxCount: 5,
  },
]);

module.exports = { uploadMiddleware };
