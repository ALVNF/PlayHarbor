
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const { db } = require('../firebase'); // Importa db desde firebase.js
const { storage } = require('../firebase'); 
const { admin } = require('../firebase'); 
const { release } = require('os');
const socketIo = require('socket.io');

const rutaWeb = "https://localhost:3000/juegos/"

// Asume que admin ya ha sido inicializado anteriormente en tu código
const bucket = admin.storage().bucket();

/*
FUNCIONES A LLAMAR DENTRO DEL JUEGO:

    -empezarPartJuego() -> Se le manda nombre de juego a la API, se crea match en FB, se retorna el id del match
                        El match se guarda donde mismo que el usr.
    -terminarPartJuego()
    -getPuntuacionesJuego() 
    -updatePuntuacionJuego() -> Se pasa el id del match, que score actualizar y a quien, en caso de 
    no ser a nadie en especifico (Ej: tiempo de partida), poner en parte de jugador = ""

*/

/*SI implementada*/
router.get('/jugar', (req, res) => {
    const nombreJuego = req.query.nombre;
    const rutaJuego = rutaWeb+nombreJuego+"/index.html";

    res.send(rutaJuego);
});


//Crear una funcion getJuegos()


/*
Medio implementada. 
    -Ver como referenciar a las imagenes guardadas en Storage
*/
router.get('/infoJuego', async (req, res) => {
    try {
        const nombreJuego = (req.query.nombre).toLowerCase();
        const docRef = db.collection('games').doc(nombreJuego);
        const snapshot = await docRef.get();
        if (snapshot.empty) {
            res.json({ message: "No se ha encontrado el juego solicitado" });
            return;
        }
        const datos = snapshot.data();
        var tags = await getInfoTags(datos.tags); 
        tags = Object.fromEntries(tags);
        const infoJuego = {
            name: datos.name,
            description: datos.description,
            releaseDate: datos.releaseDate,
            platforms: datos.platforms,
            developer: datos.developer,
            tags: tags
        }
        res.json({ datos: infoJuego});

    } catch (error) {
        res.status(500).json({ message: 'Error al conectar con Firestore.', error: error.message });
    }
});


/**SI IMPLEMENTADA**/
router.get('/imgsJuego', async (req, res) => {
    try {
        const nombreJuego = (req.query.nombre).toLowerCase(); // Obtener el nombre del juego de la consulta
        const tipo = (req.query.tipo).toLowerCase(); // El tipo de imagen
        const urlsImagenes = await obtenerURLImagen(nombreJuego, tipo);

        res.json({ urls: urlsImagenes });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/*SI IMPLEMENTADA*/
async function obtenerURLImagen(nombreJuego, tipo) {
    const folderPath = `games/${nombreJuego}/${tipo}/`; // La ruta de la carpeta
    const [files] = await bucket.getFiles({ prefix: folderPath });

    const urlsPromises = files.map(async (file) => {
        if (!file.name.endsWith('/')) { // Ignora los "directorios" que son listados como archivos
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491' // Asegúrate de poner una fecha de expiración adecuada
            });
            return url;
        }
    });

    // Filtra los valores undefined en caso de que haya "directorios"
    return (await Promise.all(urlsPromises)).filter(url => url);
}

/*SI IMPLEMENTADA*/
async function getInfoTags(tags){
    
    const infoTags = new Map();
    
    for (const tag of tags) {
        
        const infoTag = await  getInfoTag(tag);
        
        infoTags.set(tag, infoTag);
    }

    return infoTags;

}

/*SI IMPLEMENTADA*/
async function getInfoTag(tag){
    const docRef = db.collection('tags').doc(tag);
    
    const snapshot = await docRef.get();
        if (snapshot.empty) {
            return;
        }
        
        return snapshot.data();
}

//No implementada, crea una partida nueva en la colección de matches
router.get('/empezarPartJuego', async (req, res) => {
    try {
        const nombreJuego = (req.query.nombre).toLowerCase();
        //const creadorPartida = (req.query.user).toLowerCase();
        const docRef = db.collection('games').doc(nombreJuego).collection('matches');
        const snapshot = await docRef.get();
        if (snapshot.empty) {
            res.json({ message: "No se ha encontrado el juego solicitado" });
            return;
        }

        res.json({ datos: snapshot.data()});
    } catch (error) {
        res.status(500).json({ message: 'Error al conectar con Firestore.', error: error.message });
    }
  });


/*No implementada, esta funcion actualiza la entrada de "matches correspondiente, y todo lo relacionado"*/
router.get('/terminarPartJuego', async (req, res) => {
    try {
        const nombreJuego = (req.query.nombre).toLowerCase();
        const docRef = db.collection('games').doc(nombreJuego);
        const snapshot = await docRef.get();
        if (snapshot.empty) {
            res.json({ message: "No se ha encontrado el juego solicitado" });
            return;
        }

        res.json({ datos: snapshot.data()});
    } catch (error) {
        res.status(500).json({ message: 'Error al conectar con Firestore.', error: error.message });
    }
});


//SI IMPLEMENTADA
router.get('/comentsJuego', async (req, res) => {
    try {
        const nombreJuego = (req.query.nombre).toLowerCase();
        const docRef = db.collection('games').doc(nombreJuego).collection("comments");
        const snapshot = await docRef.get();
        if (snapshot.empty) {
            res.json({ message: "Se el primero en dejar un comentario!"});
            return;
        }

        /*A falta de recuperar mas informacion correspondiente al user para mostrar en comentario*/
        const comentarios = [];
        snapshot.forEach(doc => {
            comentarios.push({
                user: doc.data().user,
                title: doc.data().title,
                text: doc.data().text,
                date: doc.data().date,
                likes: doc.data().likes,
                dislikes: doc.data().dislikes
            });
        });

        res.json({ comments: comentarios });
    } catch (error) {
        res.status(500).json({ message: 'Error al conectar con Firestore.', error: error.message });
    }
});

/*No implementada. No prioritaria. Ver si se puede mandar en /infoJuego y dejar esta como func normal*/
router.get('/globalClasifJuego', async (req, res) => {
    try {
        const nombreJuego = (req.query.nombre).toLowerCase();
        const docRef = db.collection('games').doc(nombreJuego).collection("comments");
        const snapshot = await docRef.get();
        if (snapshot.empty) {
            res.json({ message: "Se el primero en dejar un comentario!" });
            return;
        }

        /*A falta de recuperar mas informacion correspondiente al user para mostrar en comentario*/
        const comentarios = [];
        snapshot.forEach(doc => {
            comentarios.push({
                user: doc.data().user,
                text: doc.data().text
            });
        });

        res.json({ comments: comentarios });
    } catch (error) {
        res.status(500).json({ message: 'Error al conectar con Firestore.', error: error.message });
    }
});

module.exports = router;