const express = require("express");
const app = express(); //App actua como servidor

//Uses
app.use(express.json()); //Lo que realize es colocar el body en un objeto {}

//Metodos de Peticion HTTP
app.get('/', (req,res)=> {
    res.status(200).json({success: true, message: "Mensaje de good"});
})


module.exports = app


/*  
    ------- Concepto de Req ------
    En si seria lo requerido desde el front
    Contiene:
        - PARAMS{}
        - QUERY{}
        - BODY{}
    ¿Como accedes a cada seccion?
    ej: const dataUserName = req.params.username
    // Pruebas 
    app.get('/info/:username', (req,res)=> {
        const params = req.params;
        const query = req.query;
        const body = req.body;
        
        res.status(200).json({name: "Informacion de  require", parametros: params.username, consulta: query, cuerpo: body} )
    })

    ------ Conceptos de Res -------
    Contiene la respuesta que mandaremos al front
    los métodos que contiene son :
    res.status(code) → Define el código de estado HTTP (ej. 200, 404, 500).
    res.send(data) → Envía una respuesta simple (texto, HTML, JSON, etc).
    res.json(obj) → Envía una respuesta en formato JSON (ideal para APIs).
    res.redirect(url) → Redirige a otra URL.
    res.set(header, value) → Establece encabezados personalizados.

    ------ Concepto de Middleware ------
    Ejemplo de get con funciones callback:
    app.get('/', funcionX,()=>{}, (req,res)=>{})

    En este caso funcionX y la de al lado pueden 
    son funciones intermediaras (Estas funciones, 
    intermedias son denominadsa middleware, estas son
    usadas normalmente para hacer validaciones)
    se ejecutan para luego ejecutar la funcion final
    donde definis  realmente tu respuesta "res". 

    Codigo viejo: 
    const server = http.createServer((req,res) => {
    res.end("Mi primer server---");
});

 */