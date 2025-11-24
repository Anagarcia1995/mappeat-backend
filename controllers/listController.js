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
      restaurants: restaurants || []
    });

    res.status(201).json({
      ...newList._doc,
      likesCount: newList.likes.length
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la lista" });
  }
};

// OBTENER TODAS LAS LISTAS PÚBLICAS (filtrado opcional por categoría)
export const getPublicLists = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isPublic: true };
    if (category) filter["restaurants.category"] = category;

    const lists = await List.find(filter).populate("owner", "username avatar").sort({ createdAt: -1 }).lean();

    const listsWithLikes = lists.map(list => ({
      ...list,
      likesCount: list.likes.length
    }));

    res.json(listsWithLikes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener listas" });
  }
};

// OBTENER LISTAS MÁS POPULARES (ordenadas por ratingGoogle promedio)
export const getPopularLists = async (req, res) => {
  try {
    const lists = await List.find({ isPublic: true }).populate("owner", "username avatar").lean();

    // Calcular promedio de ratingGoogle de cada lista
    lists.forEach(list => {
      const ratings = list.restaurants.map(r => r.ratingGoogle || 0);
      list.avgRatingGoogle = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      list.likesCount = list.likes.length;
    });

    lists.sort((a, b) => b.avgRatingGoogle - a.avgRatingGoogle);

    res.json(lists.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: "Error al obtener listas populares" });
  }
};

// LISTAS PÚBLICAS CON FILTROS, CATEGORÍAS Y PAGINACIÓN
export const getLists = async (req, res) => {
  try {
    let { category, sortBy, page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = { isPublic: true };
    if (category) filter["restaurants.category"] = category;

    let listsQuery = List.find(filter).populate("owner", "username avatar");

    // Ejecutamos query
    let lists = await listsQuery.lean();

    // Ordenamiento
    if (sortBy === "likes") {
      lists.sort((a, b) => b.likes.length - a.likes.length);
    } else if (sortBy === "ratingGoogle") {
      lists.forEach(list => {
        const ratings = list.restaurants.map(r => r.ratingGoogle || 0);
        list.avgRatingGoogle = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      });
      lists.sort((a, b) => b.avgRatingGoogle - a.avgRatingGoogle);
    } else {
      lists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Añadir likesCount
    lists = lists.map(list => ({ ...list, likesCount: list.likes.length }));

    // Paginación
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedLists = lists.slice(start, end);

    res.json({
      page,
      limit,
      total: lists.length,
      results: paginatedLists
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener listas con filtros" });
  }
};

// OBTENER LISTA POR ID
export const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id).populate("owner", "username avatar").lean();
    if (!list) return res.status(404).json({ error: "Lista no encontrada" });

    res.json({ ...list, likesCount: list.likes.length });
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

    res.json({ ...list._doc, likesCount: list.likes.length });
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
    res.json({ ...list._doc, likesCount: list.likes.length });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar favorito" });
  }
};

// OBTENER FAVORITOS
export const getFavoriteLists = async (req, res) => {
  try {
    const lists = await List.find({ likes: req.user.id }).populate("owner", "username avatar").sort({ createdAt: -1 }).lean();

    const listsWithLikes = lists.map(list => ({ ...list, likesCount: list.likes.length }));
    res.json(listsWithLikes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener listas favoritas" });
  }
};

// OBTENER LISTAS DEL USUARIO LOGUEADO
export const getMyLists = async (req, res) => {
  try {
    const lists = await List.find({ owner: req.user.id }).sort({ createdAt: -1 }).lean();

    const listsWithLikes = lists.map(list => ({ ...list, likesCount: list.likes.length }));
    res.json(listsWithLikes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tus listas" });
  }
};

// OBTENER CATEGORÍAS DINÁMICAS
export const getCategories = async (req, res) => {
  try {
    const lists = await List.find({ isPublic: true }).lean();
    const categories = new Set();

    lists.forEach(list => {
      list.restaurants.forEach(r => {
        if (r.category) categories.add(r.category);
      });
    });

    res.json(Array.from(categories));
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo categorías" });
  }
};
