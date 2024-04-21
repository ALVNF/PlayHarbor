const express = require('express');
const router = express.Router();
const WebSocket = require('ws');

var datos2;
const wss = new WebSocket.Server({ port: 8082 }); //Juego
const wsc = new WebSocket.Server({ port: 8081 }); //Cliente

wss.on('headers', (headers, request) => {
    headers.push('Access-Control-Allow-Origin: *');
    headers.push('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
    headers.push('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
});

wss.on('connection', (ws) => {
    console.log('Juego conectado al servidor WebSocket');

    ws.on('message', (mensaje) => {
        console.log('Mensaje recibido del juego: ' + mensaje);

        try {
            const datos = JSON.parse(mensaje);
            console.log('Datos recibidos: ', datos);
        
            wsc.clients.forEach((cliente) => {

                cliente.send(JSON.stringify(datos)); 
            });

        } catch (error) {
            console.error('Error al analizar el mensaje JSON:', error);
        }
    })


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