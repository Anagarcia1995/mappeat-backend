import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Campos obligatorios
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Usuario existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "Email ya registrado" });

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password
    });

    res.status(201).json({
      message: "Usuario creado",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ error: "Error en el registro" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email y contraseña obligatorios" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    res.json({
      message: "Login correcto",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      },
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
};
