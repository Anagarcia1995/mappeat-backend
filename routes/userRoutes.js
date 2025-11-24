import express from "express";
import { getProfile, updateProfile, getMyLists, searchUsers, deleteProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Perfil del usuario
router.get("/me", protect, getProfile);
router.delete("/me", protect, deleteProfile);
router.put("/me", protect, upload.single("avatar"), updateProfile);

// Listas del usuario
router.get("/me/lists", protect, getMyLists);

// Buscar usuarios por username
router.get("/search", protect, searchUsers);

export default router;
