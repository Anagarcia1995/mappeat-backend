import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

// Obtener perfil del usuario logueado
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

// Actualizar perfil (username, email, avatar opcional)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const { username, email, password } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;

    // Si se sube un avatar con multer
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    // Si se cambia la contraseña
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      message: "Perfil actualizado",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
};
