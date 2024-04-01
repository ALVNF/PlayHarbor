const express = require('express');
const router = express.Router();
const WebSocket = require('ws');

var datos2;

const wsc = new WebSocket.Server({port:8082},()=>{
    console.log('server started')
})

const wss = new WebSocket.Server({port:8081},()=>{
    console.log('server started')
})

wss.on('listening',()=>{
    console.log('game is listening on port 8081');
})

wss.on('connection', (ws) => {
    console.log('Juego conectado al servidor WebSocket');

    // Manejar los mensajes recibidos desde el cliente
    ws.on('message', (mensaje) => {
        console.log('Mensaje recibido del juego: ' + mensaje);

        try {
            // Intentar analizar el mensaje JSON
            const datos = JSON.parse(mensaje);
            
            console.log('Datos recibidos: ', datos);

            datos2 = datos.puntuacionJ1
            console.log(datos2);
            
            wsc.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(datos));
                }
                });
            
            // Enviar el mensaje JSON como tengo en la imagen del bloc de notas de Pepe al cliente

        } catch (error) {
            console.error('Error al analizar el mensaje JSON:', error);
        }
    })

    // Manejar la desconexión del cliente
    ws.on('close', () => {
        console.log('Juego desconectado del servidor WebSocket');
    })
})

wsc.on('connection', (ws) => {
    console.log('Cliente conectado al servidor WebSocket');

    // Manejar los mensajes recibidos desde el cliente
    ws.on('message', (mensaje) => {
        console.log('Mensaje recibido del cliente: ' + mensaje);

        try {
            // Intentar analizar el mensaje JSON
            const datos = JSON.parse(mensaje);
            console.log('Datos recibidos: ', datos);

            datos2 = datos.puntuacionJ1
            console.log(datos2);

            ws.send(JSON.stringify(datos));

        } catch (error) {
            console.error('Error al analizar el mensaje JSON:', error);
        }
    })

    // Manejar la desconexión del cliente
    ws.on('close', () => {
        console.log('Cliente desconectado del servidor WebSocket');
    })
})

module.exports = router;