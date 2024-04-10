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
    ws.send("JoaquinPutoAmo");
    // Manejar los mensajes recibidos desde el cliente
    ws.on('message', (mensaje1, mensaje2) => {
        console.log('Mensaje recibido del juego: ' + mensaje1 + mensaje2);

        try {
            // Intentar analizar el mensaje JSON
            const datosJ1 = JSON.parse(mensaje1);
            const datosJ2 = JSON.parse(mensaje2);
            
            console.log('Datos recibidos: ', datosJ1, datosJ2);
            
            wsc.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    data: datosJ1.puntuacionJ1,
                    type: 'puntuacion',
                    name: "Puntuacion J1",
                    subtype: "Puntos",
                    usr: ""}));

                client.send(JSON.stringify({
                    data: datosJ1.tiempoTranscurrido,
                    type: 'puntuacion',
                    name: "Tiempo partida",
                    subtype: "Segundos",
                    usr: ""}));
                
                client.send(JSON.stringify({
                    data: datosJ1.colisionesPala1,
                    type: 'puntuacion',
                    name: "Colisiones J1",
                    subtype: "Colisiones",
                    usr: ""}));

                client.send(JSON.stringify({
                    data: datosJ2.puntuacionJ2,
                    type: 'puntuacion',
                    name: "Puntuacion J1",
                    subtype: "Puntos",
                    usr: ""}));

                client.send(JSON.stringify({
                    data: datosJ2.tiempoTranscurrido,
                    type: 'puntuacion',
                    name: "Tiempo partida",
                    subtype: "Segundos",
                    usr: ""}));
                
                client.send(JSON.stringify({
                    data: datosJ2.colisionesPala2,
                    type: 'puntuacion',
                    name: "Colisiones J2",
                    subtype: "Colisiones",
                    usr: ""}));
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