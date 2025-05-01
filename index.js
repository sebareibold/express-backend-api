const app = require("./src/server.js");

const PORT = 8080; //Se usa comunmente el puerto 8080 en produccion

app.listen(PORT, ()=> {
    console.log(`Server Escuchando en el puerto: http://localhost:${PORT}`);
})

