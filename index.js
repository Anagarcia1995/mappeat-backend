import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import listRoutes from "./routes/listRoutes.js"


dotenv.config();

const app = express();
const PORT = process.env.port || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta estática
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔵 RUTAS
app.use("/auth", authRoutes); 
app.use("/users", userRoutes);
app.use("/lists", listRoutes);

app.get("/", (req, res) => {
  res.send("Mappeat API funcionando");
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Error MongoDB", err));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
