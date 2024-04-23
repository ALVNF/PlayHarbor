const path = require('path');
const fs = require('fs');
const { db } = require('../firebase'); // Importa db desde firebase.js
const { storage } = require('../firebase'); 
const { admin } = require('../firebase'); 
const { release } = require('os');
const socketIo = require('socket.io');

const bucket = admin.storage().bucket();


const express = require('express');
const router = express.Router();
const WebSocket = require('ws');

let nameGame = null;
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
    /*
    ws.on('puntuacionFinal', async (data) => {//Obtenemos la puntuación final del websocket
        try{
            const usuario = data.usr;//Nombre del usuario

            const puntuacion = data.valor;//Valor de la puntuación recibido
            const puntuacionAGuardar = Math.log2(puntuacion); //Función matemática de puntuación final
            console.log("Puntuación final para" + usuario + "es: " + puntuacionAGuardar);
            console.log("PUNTUACIÓN FINAL RECIBIDA");
        }catch(error){
            console.error("error en puntuacion final");
        }
    });*/

    ws.on('message', (mensaje) => {
        console.log('Mensaje recibido del juego: ' + mensaje);
        let patata = JSON.parse(mensaje);
        
        if (patata.type == "juego"){//detectamos el juego
            console.log("El juego es: "+ patata.data);
            nameGame = patata.data;
            nameGame = nameGame.toLowerCase();//se pasa a minúsuclas para prevenir problemas con firebase (Puede crear documentos de más)
        }

        if (patata.type == "puntuacionFinal"){
            console.log("Recibida la puntuacion final");
            const puntuacion = Math.random() * 1000;
            puntuacionAlgoritmo = Math.log10((puntuacion * 3)/(((1.5*1.5)*1)*1));//algoritmo de cálculo de puntuación final
            console.log("puntos finales:" + puntuacionAlgoritmo);//Esto es la puntuación final
            //Guardamos siempre al user alvaro: alvaro@mail.com
            //console.log("ESTE JUEGO ES: " + nameGame);
            const coleccion = db.collection('games').doc(nameGame).collection('matches').doc('0').collection('teams').doc('0').collection('scores')
            coleccion.doc('alvaro@mail.com').get().then((docSnapshot) => {//revisamos si esta el user
                if(docSnapshot.exists){//Si el user esta
                    const data = docSnapshot.data();//obtenemos los datos
                    if(data.hasOwnProperty('finalPoints')){//revisamos que exista el campo de puntuacion
                        let puntosFinales = data['finalPoints'] + puntuacionAlgoritmo;//sumamos los puntos viejos a los nuevos
                        return coleccion.doc('alvaro@mail.com').update({//Actualizamos la base de datos
                            ['finalPoints']: puntosFinales
                        });
                    }else{//Si el campo no existe
                        coleccion.doc('alvaro@mail.com').update({
                            ['finalPoints']: puntuacionAlgoritmo
                        });
                        console.log("Datos añadidos")
                    }
                }else{//Si el usuario no está en la base de datos
                    const addUsuario ={
                        finalPoints: puntuacionAlgoritmo
                    }

                    coleccion.doc('alvaro@mail.com').set(addUsuario)//Insertamos el nuevo documento
                    console.log("Colección añadida");
                }
            })

        }else{
            
            try {
                const datos = JSON.parse(mensaje);
                console.log('Datos recibidos: ', datos);
        
                wsc.clients.forEach((cliente) => {

                    //console.log("CLIENTE: " + cliente);
                
                    cliente.send(JSON.stringify(datos)); 
                });

        } catch (error) {
            console.error('Error al analizar el mensaje JSON:', error);
        }
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