const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/posts");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").split(".").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    console.log({ file });
    if (Object.keys(MIME_TYPES).indexOf(file.mimetype) == -1) {
      return callback(new Error("Format incorrect"));
    }
    callback(null, true);
  },
  limits: { fileSize: 1000000 }, // 1000000 bytes = 1 Mo
}).single("file");

module.exports = async (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.message.includes("File too large")) return res.status(500).json({ erreur: "L'image est trop volumineuse" });
      return res.status(500).json(err);
    } else if (err) {
      if (err.message.includes("Format incorrect")) return res.status(500).json({ erreur: "Format de fichier incorrect" });
      return res.status(500).json(err);
    }

    next();
  });
};
