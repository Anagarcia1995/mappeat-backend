import multer from "multer";
import path from "path";

// Configuración almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  }
});

// Validación de archivo
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato no permitido"), false);
  }
};

// Multer final
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

export default upload;
