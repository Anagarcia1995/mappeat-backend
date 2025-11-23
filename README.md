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
