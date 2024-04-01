const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const { db } = require('../firebase'); // Importa db desde firebase.js
const { storage } = require('../firebase'); 
const { admin } = require('../firebase'); 
const { release } = require('os');
const socketIo = require('socket.io');

const rutaWeb = "https://localhost:3000/logros/"

const bucket = admin.storage().bucket();

router.get('/logrosUser', async (req, res) =>{//Funcionalidad para obtener logros y sus datos
    console.log("Boton testLogrosUsuarioPulsado");
    try{

        //--------------------------------------------------------------------------------------------------//
        //**************************************************************************************************//
        //************************Sección 1: Obtención de logros del usuario********************************//
        //**************************************************************************************************//
        //--------------------------------------------------------------------------------------------------//
        //CAMBIOS PENDIENTES:  cambiar "admin" por UsuarioBuscado

        /* for (const juegoDoc of juegosSnapshot.docs) {
        const juegosSnapshot = await db.collection("games").get();*/

        //OJO: en un futuro el admin debe ser sustituido por nombreUser <-----
        const docRef =  db.collection('users').doc("admin").collection("achivementsByGame");
        const snapshot = await docRef.get();
        const LogrosDelUsuario = {};//Aquí se almacenan los logros del usuario indicado
        if(snapshot.empty){
            console.log("Logros no localizados");
            res.json({message: "No se han lozalizado logros"});
        }else{
            const listadoJuegos = [];//IMPORTANTE: Almacena los obtenidos por el USUARIO en función del juego
            //let pos = 0;
            const listadoLogrosPorJuego = {};//Hashmap para almacenar juegos y sus logros
            for (const doc of snapshot.docs) {//recoremos la colección de logros del usuario
                const datos = doc.data();//vamos mostrando cada doc de la colección
                const nombreJuego = doc.id;
                const LogrosJuego = Object.keys(datos);
                console.log("DOC ID: " + nombreJuego);//esto nos da el nombre del juego
                console.log(LogrosJuego);//esto otro nos da el nombre de los logros
                
                listadoLogrosPorJuego[nombreJuego] = LogrosJuego;//almacenamos los logros del usuario por juego

                /*
                listadoJuegos[pos] = nombreJuego;//almacenamos juegos en lista de juegos
                pos++;//incrementamos en 1 la posición del array
                */

            };
            console.log(listadoLogrosPorJuego);//Mostramos listado resultante por consola
            console.log(listadoJuegos);
            
        //--------------------------------------------------------------------------------------------------//
        //**************************************************************************************************//
        //************************Sección 2: Obtención de logros de cada juego******************************//
        //**************************************************************************************************//
        //--------------------------------------------------------------------------------------------------//

            if(!listadoLogrosPorJuego.empty){//Si el usuario tiene algún logro
                const ListaLogrosGenerales = [];//IMPORTANTE: Almacena los logros de un juego en específico con los campos de estos
                //OJO <-- esto tiene que ser iterativo, de forma que cuando esté en bucle el potatogame sera cambiado por NombreJuego
                const DocRefGames = db.collection("achievements").doc("games");
                const snapshotGames = await DocRefGames.get();
                const ListadoJuegosSnapshot = await DocRefGames.listCollections();
                
                if(snapshotGames.empty){
                    console.log("ERROR: No se localizan juegos en achievements");
                }else{
                    for (const collection of ListadoJuegosSnapshot) {//vamos recorriendo los juegos almacenados en el doc games
                        console.log("Juego: " + collection.id); //collection.id es el nombre del juego
                        //Por cada juego que localizamos en el listado vamos obteniendo sus logros
                        const DocRefAchivements = db.collection("achievements").doc("games").collection(collection.id);//obtenemos logros de potato games
                        const snapshotAchivements = await DocRefAchivements.get();
                        if(snapshotAchivements.empty){//si no está vacío
                            console.log("ERROR: no hay logros en achivements");
                            res.json({message: "No se han localizado logros"});
                        }else{
                            for (const doc of snapshotAchivements.docs) {//Por cada logro(que debería ser un doc)
                                const datosLG = doc.data();
                                const nameJuegoLogro = doc.id;//Nombre del logro
                                const LogrosJuegoLogro = Object.keys(datosLG);//Nos debería dar los campos del logro
                                //Si el usuario tiene el logro:
                                if(listadoLogrosPorJuego[collection.id] = nameJuegoLogro){
                                    console.log("Logro Localizado: " + nameJuegoLogro);
                                    LogrosDelUsuario[nameJuegoLogro] = LogrosJuegoLogro;
                                    console.log("FIN............................................");
                                }
                            };
                            console.log(LogrosDelUsuario)
                            res.json(LogrosDelUsuario) 
                        }
                    };
                }
            }else{
                console.log("El usuario no tiene logros");
            }
        }               
    }catch (error){
        console.log("Error"+ error);
    }
}

);
module.exports = router;