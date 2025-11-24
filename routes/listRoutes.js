import express from "express";
import {
  createList,
  getPublicLists,
  getListById,
  updateList,
  deleteList,
  toggleFavorite,
  getFavoriteLists,
  getMyLists,
  getPopularLists,
  getLists,
  getCategories
} from "../controllers/listController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Listas del usuario
router.get("/mine", protect, getMyLists);

// Listas populares (ordenadas por ratingGoogle promedio)
router.get("/popular", getPopularLists);

// Listas públicas filtradas y paginadas
router.get("/filtered", getLists);

// Obtener todas las listas públicas
router.get("/", getPublicLists);

// Obtener lista por ID
router.get("/:id", getListById);

// Crear lista
router.post("/", protect, createList);

// Actualizar lista
router.put("/:id", protect, updateList);

// Borrar lista
router.delete("/:id", protect, deleteList);

// Favoritos
router.put("/:id/favorite", protect, toggleFavorite);
router.get("/favorites/me", protect, getFavoriteLists);

// Endpoint para obtener categorías dinámicas
router.get("/categories/list", getCategories);

export default router;
