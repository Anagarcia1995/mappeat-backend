DÍA 1

Hoy he completado la primera fase de la API para Mappeat, una aplicación web/social donde los usuarios pueden guardar, organizar y compartir sus listas de restaurantes favoritos basados en Google Maps/Google Places.

Durante este primer día se han completado las bases técnicas del proyecto, asegurando que la arquitectura esté limpia, segura y preparada para escalar.


Funcionalidades completadas
🔐 1. Sistema de Autenticación

Registro de usuarios (/auth/register)

Login con generación de token JWT (/auth/login)

Hasheo de contraseñas con bcrypt

Middleware protect para proteger rutas mediante Authorization: Bearer <token>

👤 2. Gestión de Usuario

Obtener perfil del usuario autenticado (/users/me)

Actualizar datos del usuario

Subida de avatar con multer

Validación de email y sanitización de datos

📋 3. Modelo de Listas y Restaurantes

Implementado sistema sólido para:

Crear listas de restaurantes

Guardar nombre, descripción, visibilidad

Añadir restaurantes provenientes de Google Places

Guardar valoración personal del usuario y comentario

Guardar valoraciones de Google

Todo bajo un esquema Mongoose correctamente validado.

🗂️ 4. CRUD Básico de Listas

Rutas implementadas:

POST /lists/ → crear lista

GET /lists/ → ver listas públicas

GET /lists/:id → ver lista concreta

PUT /lists/:id → actualizar una lista propia

DELETE /lists/:id → eliminar una lista propia

Con seguridad completa:

Solo el dueño puede editar o eliminar sus listas

Validaciones claras en todos los endpoints

📁 5. Configuración de proyecto

Estructura modular, limpia y escalable

Multer configurado para subir imágenes de comentarios y avatares (máx 5MB)

Servidor Express funcionando con CORS

Conexión establecida a MongoDB

Directorio /uploads servido estáticamente

Dependencias esenciales instaladas: Express, Mongoose, JWT, bcrypt, multer, cors, validator, rate-limit, nodemon…


El backend está ya completamente preparado para empezar la lógica central del proyecto.
Hoy hemos dejado lista toda la base: autenticación, perfiles, listas, seguridad, subida de imágenes y CRUD.

/////////////////////////////////

DÍA 2

Hoy hemos avanzado con la segunda fase de desarrollo del backend, centrada en la interacción social básica mediante favoritos y gestión de listas propias.

Funcionalidades completadas
❤️ 1. Favoritos

Implementado sistema de marcar/desmarcar favoritos en listas de restaurantes.

Endpoint PUT /lists/:id/favorite:

Permite a un usuario marcar o quitar una lista como favorita.

Actualiza el array de likes en la base de datos.

Endpoint GET /lists/favorites/me:

Devuelve todas las listas que el usuario ha marcado como favoritas.

Totalmente funcional con JWT y middleware de protección.

📋 2. Mis listas

Endpoint GET /lists/mine:

Devuelve únicamente las listas creadas por el usuario autenticado.

Permite al frontend mostrar el panel de “mis listas”.

Validación de propiedad y seguridad completa.

🔹 Consideraciones técnicas

Todas las rutas sensibles están protegidas con middleware protect que verifica JWT.

Las rutas están estructuradas para que /mine y /favorites/me no colisionen con rutas de parámetros (/:id).

Se mantuvo la modularidad y limpieza del código:

listController.js para toda la lógica de listas

listRoutes.js para organizar las rutas

La subida de imágenes (avatars y comentarios) sigue soportada mediante multer.

DÍA 2 – Parte 2

Hemos añadido funcionalidades adicionales para mejorar la experiencia social y de filtrado en Mappeat, así como integración más completa con Google Places.

Funcionalidades completadas

🌐 1. Búsqueda y filtrado de restaurantes

Endpoint GET /places/search permite buscar restaurantes por tipo o palabra clave (query) cerca de una ubicación concreta (location).

Endpoint GET /places/:placeId devuelve detalles de un restaurante específico.

Se devuelve información relevante: nombre, dirección, ubicación, rating de Google, tipos y fotos.

Preparado para mostrar filtros dinámicos en el frontend según categorías de Google Places.

📊 2. Ordenamiento y paginación de listas

Endpoint GET /lists permite filtrar por categoría, ordenar por número de likes o por más reciente.

Paginación configurable (page y limit) para optimizar la carga de datos en frontend.

Las listas públicas pueden visualizarse en orden de creación o popularidad según las necesidades de la interfaz.

👥 3. Búsqueda de usuarios

Endpoint GET /users/search permite buscar usuarios por username (parcial o completo).

Funciona tipo “Instagram”, mostrando nombre de usuario y avatar.

Preparado para futuras interacciones sociales y exploración de contenido.

💡 4. Contador de likes y popularidad de listas

Todas las listas cuentan con array de likes.

Endpoint /lists/popular devuelve las 10 listas públicas más populares ordenadas por número de likes.

Se puede reutilizar en futuras funcionalidades sociales como ranking, recomendaciones o feed dinámico.

🔹 Consideraciones técnicas

Se ha añadido category a los restaurantes dentro de las listas para facilitar filtrado dinámico y futuras integraciones de exploración.

Todas las rutas siguen protegidas por JWT cuando es necesario.

Se mantiene consistencia y modularidad del código en controllers y routes.

Preparado para conectar con frontend y mostrar mapas con pines, filtros por categoría y listas de usuarios o restaurantes destacados.