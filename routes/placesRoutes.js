import express from "express";
import { searchPlaces, getPlaceDetails } from "../controllers/placesController.js";

const router = express.Router();

// Buscar restaurantes por palabra clave o categoría
router.get("/search", searchPlaces);

// Obtener detalles de un restaurante por placeId
router.get("/details/:placeId", getPlaceDetails);

export default router;
