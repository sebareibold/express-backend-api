# Proyecto de Práctica API REST con Express.js

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Handlebars.js](https://img.shields.io/badge/Handlebars.js-EA7F2B?style=for-the-badge&logo=handlebarsdotjs&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socketdot.io-000000?style=for-the-badge&logo=socketdotio&logoColor=white)

## Objetivo del Proyecto
Este proyecto fue desarrollado con el objetivo principal de aprender y profundizar en el desarrollo backend, utilizando el reconocido framework Express.js sobre Node.js.

Se construyó una API REST con el propósito de comprender a fondo los conceptos fundamentales de una arquitectura backend típica. Para ello, se implementó una estructura básica organizada por directorios, donde se distribuye la lógica correspondiente al ruteo, manejo de solicitudes y respuestas, así como la interacción con bases de datos simples o datos en memoria.

Además, se incorporó un endpoint denominado realTimeProducts, que permite visualizar en tiempo real los productos disponibles. Cualquier adición, eliminación o modificación se refleja inmediatamente en la lista gracias a la integración de WebSockets, específicamente mediante la librería Socket.IO.

Este repositorio fue utilizado como un espacio de práctica intensiva y forma parte de la entrega final de un curso de desarrollo backend, demostrando la comprensión y aplicación de los temas tratados.

## Tecnologías Utilizadas

*   **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
*   **Express.js**: Framework minimalista y flexible para la construcción de aplicaciones web y APIs en Node.js.
*   **JavaScript (ES6+)**: Lenguaje de programación principal.
*   **Handlebars**: Lenguaje para la construccion de HTML dinamico.
*   **Socket.IO**: Proporciona un canal de comunicación de bajo perfil entre el servidor y el cliente.
*   **Postman**: cliente HTTP para probar y documentar APIs RESTful.

## Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

*   [Node.js](https://nodejs.org/): Incluye npm (Node Package Manager).
*   [Git](https://git-scm.com/): Para clonar el repositorio.

## Cómo Clonar y Probar el Proyecto

Sigue estos pasos para obtener una copia del proyecto en tu máquina local y ejecutarlo:

1.  **Clona el repositorio:**
    Abre tu terminal o línea de comandos y ejecuta:
    ```bash
    git clone https://github.com/sebareibold/apirest-practice.git
    ```

2.  **Navega al directorio del proyecto:**
    ```bash
    cd apirest-practice
    ```

3.  **Instala las dependencias:**
    Utiliza npm para instalar todas las librerías necesarias definidas en `package.json`:
    ```bash
    npm install
    ```

4.  **Inicia el servidor:**
    Ejecuta el script de inicio definido en `package.json`:
    ```bash
    npm start
    ```
    El servidor debería iniciar y mostrar un mensaje en la consola indicando en qué puerto está escuchando 8080.

5.  **Prueba la API:**
    Puedes usar herramientas como [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/) para interactuar con los endpoints de la API.

## Estado del Proyecto

*   En desarrollo / Fase de aprendizaje.

## Autor

*   **Sebastián Alejandro Reibold** - [Perfil de GitHub](https://github.com/sebareibold)
