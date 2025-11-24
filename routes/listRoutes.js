import express from "express";
import {
  createList,
  getPublicLists,
  getListById,
  updateList,
  deleteList,
  toggleFavorite,
  getFavoriteLists,
  getMyLists
} from "../controllers/listController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


//LISTAS DEL USUARIO
router.get("/mine", protect, getMyLists)


// CRUD LISTAS
router.post("/", protect, createList);
router.get("/", getPublicLists);
router.get("/:id", getListById);
router.put("/:id", protect, updateList);
router.delete("/:id", protect, deleteList);

// FAVORITOS
router.put("/:id/favorite", protect, toggleFavorite);
router.get("/favorites/me", protect, getFavoriteLists)


export default router;
