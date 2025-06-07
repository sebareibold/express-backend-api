# Proyecto de Práctica API REST con Express.js y MongoDB

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Handlebars](https://img.shields.io/badge/Handlebars-EA7F2B?style=for-the-badge&logo=handlebarsdotjs&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socketdot.io-000000?style=for-the-badge&logo=socketdotio&logoColor=white)

## Objetivo del Proyecto
Este proyecto fue desarrollado con el objetivo principal de aprender y profundizar en el desarrollo backend, utilizando el reconocido framework Express.js sobre Node.js, integrado con MongoDB como base de datos.

Se construyó una API REST completa con el propósito de comprender a fondo los conceptos fundamentales de una arquitectura backend moderna. Para ello, se implementó una estructura organizada por directorios, donde se distribuye la lógica correspondiente al ruteo, manejo de solicitudes y respuestas, así como la interacción con una base de datos MongoDB mediante Mongoose.

La aplicación incluye un sistema completo de gestión de productos y carritos de compras, con funcionalidades avanzadas como:
- **Paginación y filtrado** de productos
- **Gestión completa de carritos** (agregar, eliminar, actualizar productos)
- **Actualización en tiempo real** mediante WebSockets
- **Interfaz web interactiva** con Handlebars

Además, se incorporó un endpoint denominado realTimeProducts, que permite visualizar en tiempo real los productos disponibles. Cualquier adición, eliminación o modificación se refleja inmediatamente en la lista gracias a la integración de WebSockets, específicamente mediante la librería Socket.IO.

## Características Principales

### 🛍️ Gestión de Productos
- CRUD completo de productos
- Filtrado por categoría, precio, stock, etc.
- Paginación y ordenamiento
- Validación de datos con Mongoose

### 🛒 Sistema de Carritos
- Creación y gestión de carritos
- Agregar/eliminar productos del carrito
- Actualización de cantidades
- Persistencia en MongoDB

### 🔄 Tiempo Real
- Actualización automática de productos via WebSockets
- Sincronización en tiempo real entre clientes

### 🎨 Interfaz Web
- Vistas dinámicas con Handlebars
- Paginación interactiva
- Carrito de compras funcional
- Diseño responsivo

## Tecnologías Utilizadas

*   **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
*   **Express.js**: Framework minimalista y flexible para la construcción de aplicaciones web y APIs.
*   **MongoDB**: Base de datos NoSQL para almacenamiento de productos y carritos.
*   **Mongoose**: ODM (Object Document Mapper) para MongoDB y Node.js.
*   **JavaScript (ES6+)**: Lenguaje de programación principal.
*   **Handlebars**: Motor de plantillas para la construcción de HTML dinámico.
*   **Socket.IO**: Biblioteca para comunicación en tiempo real entre servidor y cliente.
*   **Postman**: Cliente HTTP para probar y documentar APIs RESTful.

## Estructura del Proyecto

\`\`\`
apirest-practice/
├── .env                    # Variables de entorno
├── .gitignore             # Archivos ignorados por Git
├── index.js               # Punto de entrada principal
├── package.json           # Dependencias y scripts
├── readMe.md             # Documentación del proyecto
└── src/
    ├── managers/          # Lógica de negocio
    │   ├── ProductsManager.js
    │   └── CartsManager.js
    ├── models/            # Esquemas de MongoDB
    │   ├── ProductSchema.js
    │   └── CartSchema.js
    ├── routes/            # Definición de rutas API
    │   ├── products.routes.js
    │   └── carts.routes.js
    ├── services/          # Servicios auxiliares
    │   └── socket.service.js
    ├── views/             # Plantillas Handlebars
    │   ├── layouts/
    │   ├── index.hbs
    │   └── realTimeProducts.hbs
    ├── public/            # Archivos estáticos
    │   ├── css/
    │   └── js/
    └── server.js          # Configuración del servidor
\`\`\`

## API Endpoints

### Productos
- `GET /api/products` - Obtener productos (con filtros y paginación)
- `GET /api/products/:pid` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:pid` - Actualizar producto
- `DELETE /api/products/:pid` - Eliminar producto

### Carritos
- `GET /api/carts` - Obtener todos los carritos
- `GET /api/carts/:cid` - Obtener carrito por ID
- `POST /api/carts` - Crear nuevo carrito
- `POST /api/carts/:cid/product/:pid` - Agregar producto al carrito
- `PUT /api/carts/:cid` - Actualizar carrito completo
- `PUT /api/carts/:cid/products/:pid` - Actualizar cantidad de producto
- `DELETE /api/carts/:cid/products/:pid` - Eliminar producto del carrito
- `DELETE /api/carts/:cid/products` - Vaciar carrito
- `DELETE /api/carts/:cid` - Eliminar carrito

## Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

*   [Node.js](https://nodejs.org/): Incluye npm (Node Package Manager).
*   [MongoDB](https://www.mongodb.com/): Base de datos (local o MongoDB Atlas).
*   [Git](https://git-scm.com/): Para clonar el repositorio.

## Configuración e Instalación

### 1. Clona el repositorio:
\`\`\`bash
git clone https://github.com/sebareibold/apirest-practice.git
cd apirest-practice
\`\`\`

### 2. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

### 3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/tu-base-de-datos
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database
PORT=8080
\`\`\`

### 4. Inicia el servidor:
\`\`\`bash
npm start
\`\`\`

### 5. Accede a la aplicación:
- **Interfaz web**: http://localhost:8080
- **Productos en tiempo real**: http://localhost:8080/realtimeproducts
- **API Productos**: http://localhost:8080/api/products
- **API Carritos**: http://localhost:8080/api/carts

## Uso de la API

### Ejemplos de consultas con filtros:
\`\`\`bash
# Obtener productos con paginación
GET /api/products?page=1&limit=10

# Filtrar por categoría
GET /api/products?category=electronics

# Ordenar por precio
GET /api/products?sort=price:asc

# Combinar filtros
GET /api/products?category=electronics&sort=price:desc&limit=5
\`\`\`

### Gestión de carritos:
\`\`\`bash
# Crear carrito
POST /api/carts
Body: { "products": [] }

# Agregar producto al carrito
POST /api/carts/:cid/product/:pid
Body: { "quantity": 2 }
\`\`\`

## Estado del Proyecto

✅ **Completado** - Implementación completa según especificaciones del curso.

## Funcionalidades Implementadas

- [x] Integración con MongoDB
- [x] CRUD completo de productos
- [x] Sistema de carritos funcional
- [x] Filtrado y paginación avanzada
- [x] WebSockets para tiempo real
- [x] Interfaz web interactiva
- [x] Validación de datos
- [x] Manejo de errores
- [x] Estructura modular y escalable

## Autor

*   **Sebastián Alejandro Reibold** - [Perfil de GitHub](https://github.com/sebareibold)

## Licencia

Este proyecto fue desarrollado con fines educativos como parte de un curso de desarrollo backend.
