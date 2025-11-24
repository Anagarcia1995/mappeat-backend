import dotenv from "dotenv";
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export const searchPlaces = async (req, res) => {
  try {
    const { query, location, radius = 5000, type } = req.query;

    if (!query && !type) {
      return res.status(400).json({ error: "Debes enviar query o type" });
    }

    // location debe ser "lat,lng" → ejemplo: "36.7213,-4.4216" (Málaga)
    const loc = location || "36.7213,-4.4216";

    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${loc}&radius=${radius}&key=${GOOGLE_API_KEY}`;

    if (type) url += `&type=${type}`;       // ejemplo: restaurant, cafe
    if (query) url += `&keyword=${query}`;  // ejemplo: sushi, croquetas

    const response = await fetch(url);
    const data = await response.json();

    if (data.error_message) {
      return res.status(400).json({ error: data.error_message });
    }

    // Devolvemos solo la info que necesitamos
    const results = data.results.map(place => ({
      place_id: place.place_id,
      name: place.name,
      address: place.vicinity,
      location: place.geometry.location,
      rating: place.rating,
      types: place.types,
      photos: place.photos ? place.photos.map(p => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${GOOGLE_API_KEY}`) : []
    }));

    res.json(results);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error buscando restaurantes" });
  }
};

export const getPlaceDetails = async (req, res) => {
  try {
    const { placeId } = req.params;
    if (!placeId) return res.status(400).json({ error: "Falta placeId" });

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_address,geometry,photos,types,opening_hours,formatted_phone_number&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error_message) {
      return res.status(400).json({ error: data.error_message });
    }

    const place = data.result;
    const photos = place.photos ? place.photos.map(p => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${GOOGLE_API_KEY}`) : [];

    res.json({
      place_id: placeId,
      name: place.name,
      address: place.formatted_address,
      location: place.geometry.location,
      rating: place.rating,
      phone: place.formatted_phone_number,
      types: place.types,
      opening_hours: place.opening_hours,
      photos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo detalles del lugar" });
  }
};
