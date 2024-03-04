const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { CustomError } = require("../config/error");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "imageProduct") {
      cb(null, "public/images/product");
    } else if (file.fieldname === "coverProduct") {
      cb(null, "public/images/cover");
    } else if (file.fieldname === "poster1") {
      cb(null, "public/images/poster");
    } else if (file.fieldname === "poster2") {
      cb(null, "public/images/poster");
    } else if (file.fieldname === "poster3") {
      cb(null, "public/images/poster");
    } else if (file.fieldname === "poster4") {
      cb(null, "public/images/poster");
    } else if (file.fieldname === "poster5") {
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

const uploadMiddlewareCreateProduct = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
}).fields([
  {
    name: "imageProduct",
    maxCount: 4,
  },
  {
    name: "coverProduct",
    maxCount: 1,
  },
  {
    name: "poster1",
    maxCount: 1,
  },
  {
    name: "poster2",
    maxCount: 1,
  },
  {
    name: "poster3",
    maxCount: 1,
  },
  {
    name: "poster4",
    maxCount: 1,
  },
  {
    name: "poster5",
    maxCount: 1,
  },
]);

const uploadMiddlewareSingle = multer({
  storage: storage,
}).single;

module.exports = { uploadMiddlewareCreateProduct, uploadMiddlewareSingle };
