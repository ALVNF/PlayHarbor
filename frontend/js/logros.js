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

router.get('/logrosGenerales', async (req, res) =>{//Obtebemos logros, sus campos, el juego al que pertenecen y los almacenamos en una lista (KEY: Nombre del Logro, CONTENT: Datos logros, Usuarios que lo tienen, Juego al que pertenece)

    const nombreUserAbuscar = req.query.nombre;


    var patata = {}; 

    const docRefUsuarios = db.collection("users");
    const snapshotUsuarios = await docRefUsuarios.get();
    
    if(snapshotUsuarios.empty){
        console.log("No Hay usuarios");
    }else{
        for(const doc of snapshotUsuarios.docs){
            const datos = doc.data();
            const nombreUsuarioBD = doc.id;
            if(nombreUsuarioBD == nombreUserAbuscar){
                if (!patata[nombreUsuarioBD]) {
                    patata[nombreUsuarioBD] = {};
                }
    
                const refAchUsr =  db.collection('users').doc(nombreUsuarioBD).collection("achievementsByGame");
                const snapshotAchByGameUsr = await refAchUsr.get();
                for (const juego of snapshotAchByGameUsr.docs) {
                    const datos = juego.data();
                    const nombreJuego = juego.id;
                    const achJuego = Object.keys(datos);
    
                    if (!patata[nombreUsuarioBD][nombreJuego]) {
                        patata[nombreUsuarioBD][nombreJuego] = {};
                    }
    
                    console.log("Logros de juego: " +  achJuego);
                    for(var i = 0; i<achJuego.length;i++){
                        console.log("Jugador: "+nombreUsuarioBD+" Juego: "+nombreJuego+" Logro: "+achJuego[i])
                        const docRefLogros = db.collection("achievements").doc("games").collection(nombreJuego).doc(achJuego[i]);
                        const snapLogros = await (await docRefLogros).get();
                        if (snapLogros.exists) {
                            patata[nombreUsuarioBD][nombreJuego][achJuego[i]] = snapLogros.data();
                        } else {
                            console.log("El documento", achJuego[i], "no existe.");
                        }
                    }
                }
            }


        }
        //console.log(patata);
        res.json({data: patata});
    }

});

module.exports = router;