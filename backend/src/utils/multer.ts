import multer from "multer";

const uploadCsv = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, callback) {
    if (file.mimetype === "text/csv") {
      callback(null, true);
    } else {
      callback(new Error("Only CSV allowed"));
    }
  },
});

export { uploadCsv };
