import List from "../models/ListModel.js";

// CREAR LISTA
export const createList = async (req, res) => {
  try {
    const { name, description, restaurants } = req.body;

    if (!name) return res.status(400).json({ error: "El nombre de la lista es obligatorio" });

    const newList = await List.create({
      owner: req.user.id,
      name,
      description: description || "",
      restaurants: restaurants || [] // array de restaurantes opcional
    });

    res.status(201).json(newList);

  } catch (error) {
    res.status(500).json({ error: "Error al crear la lista" });
  }
};

// OBTENER TODAS LAS LISTAS PÚBLICAS
export const getPublicLists = async (req, res) => {
  try {
    const lists = await List.find({ isPublic: true })
      .populate("owner", "username avatar")
      .sort({ createdAt: -1 });

    res.json(lists);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener listas" });
  }
};

// OBTENER LISTA POR ID
export const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id).populate("owner", "username avatar");
    if (!list) return res.status(404).json({ error: "Lista no encontrada" });

    res.json(list);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener la lista" });
  }
};

// ACTUALIZAR LISTA
export const updateList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: "Lista no encontrada" });

    if (list.owner.toString() !== req.user.id) return res.status(403).json({ error: "No autorizado" });

    const { name, description, restaurants } = req.body;

    if (name) list.name = name;
    if (description) list.description = description;
    if (restaurants) list.restaurants = restaurants;

    await list.save();

    res.json(list);

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la lista" });
  }
};

// BORRAR LISTA
export const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: "Lista no encontrada" });

    if (list.owner.toString() !== req.user.id) return res.status(403).json({ error: "No autorizado" });

    await list.deleteOne();
    res.json({ message: "Lista eliminada" });

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la lista" });
  }
};

// MARCAR/DESMARCAR FAVORITO
export const toggleFavorite = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: "Lista no encontrada" });

    const index = list.likes.findIndex(userId => userId.toString() === req.user.id);
    if (index === -1) list.likes.push(req.user.id);
    else list.likes.splice(index, 1);

    await list.save();
    res.json(list);

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar favorito" });
  }
};

//OBTENER FAVORITOS
export const getFavoriteLists = async (req, res) => {
  try {
    const lists = await List.find({ likes: req.user.id })
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

    res.json(lists);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener listas favoritas" });
  }
};

//OBTENER LISAS DEL USUARIO LOGUEADO
export const getMyLists = async (req, res) => {
  try {
    const lists = await List.find({ owner: req.user.id })
      .sort({ createdAt: -1 });

    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tus listas" });
  }
};
