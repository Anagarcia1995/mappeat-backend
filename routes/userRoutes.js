import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Obtener perfil
router.get("/me", protect, getProfile);

// Actualizar perfil
router.put("/me", protect, upload.single("avatar"), updateProfile);

export default router;
