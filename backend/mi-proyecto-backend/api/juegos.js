
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const { db } = require('../firebase'); // Importa db desde firebase.js
const { storage } = require('../firebase'); 
const { admin } = require('../firebase'); 
const { release } = require('os');
const socketIo = require('socket.io');
const multer = require('multer');

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
//Se obtienen todos los juegos y su informacion.
router.get('/todosLosJuegos', async (req, res) => {
    try {
        const juegosRef = db.collection('games');
        const snapshot = await juegosRef.get();
        const juegos = [];
        snapshot.forEach(doc => {
            juegos.push({ id: doc.id, ...doc.data() });
        });
        res.json({ juegos });
    } catch (error) {
        console.error('Error al obtener los juegos:', error);
        res.status(500).send(error.message);
    }
});

/**SI IMPLEMENTADA**/
// Filtrar juegos por etiqueta específica
router.get('/juegosPorEtiqueta', async (req, res) => {
    try {
        const etiquetaBuscada = req.query.etiqueta; // Obtiene la etiqueta de la query string
        if (!etiquetaBuscada) {
            res.status(400).send('Se requiere una etiqueta para filtrar los juegos.');
            return;
        }

        const juegosRef = db.collection('games');
        // Realiza la consulta buscando juegos que contengan la etiqueta especificada
        const snapshot = await juegosRef.where('tags', 'array-contains', etiquetaBuscada).get();

        if (snapshot.empty) {
            res.json({ juegos: [] }); // Devuelve un arreglo vacío si no hay juegos que coincidan
            return;
        }

        const juegos = [];
        snapshot.forEach(doc => {
            juegos.push({ id: doc.id, ...doc.data() }); // Agrega cada juego encontrado al arreglo
        });

        res.json({ juegos }); // Envía la lista de juegos filtrados por la etiqueta
    } catch (error) {
        console.error('Error al filtrar los juegos por etiqueta:', error);
        res.status(500).send(error.message);
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

const upload = multer({ dest: 'uploads/' });
router.post('/subirJuego', upload.fields([{ name: 'portada', maxCount: 1 }, { name: 'imagenes', maxCount: 10 }, { name: 'juego', maxCount: 1 }]), async (req, res) => {
    console.log("Hola soy subirJuego");

    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const comentario = req.body.comentario;
    const url = req.body.url;
    const tags = JSON.parse(req.body.tags);
    const plataformas = JSON.parse(req.body.plataformas);
    const infoJuego = {
        nombre: nombre,
        descripcion: descripcion,
        comentario: comentario,
        url: url,
        tags: tags,
        plataformas: plataformas
    };

    const portada = req.files['portada'][0];
    const imagenes = req.files['imagenes'];
    const juego = req.files['juego'][0];

    const rutaBase = path.join(__dirname, '../../juegos/pendientes/'+nombre);

    try {
        // Crear la carpeta del juego si no existe
        if (!fs.existsSync(rutaBase)) {
            fs.mkdirSync(rutaBase, { recursive: true });
        }

        // Definir rutas para los archivos
        const rutaPortada = path.join(rutaBase, 'portada');
        const rutaImagenes = path.join(rutaBase, 'imagenes');
        const rutaJuego = path.join(rutaBase, 'juego');

        // Crear las carpetas para los archivos
        fs.mkdirSync(rutaPortada, { recursive: true });
        fs.mkdirSync(rutaImagenes, { recursive: true });
        fs.mkdirSync(rutaJuego, { recursive: true });

        // Mover y renombrar los archivos
        fs.rename(portada.path, path.join(rutaPortada, portada.originalname), (err) => {
            if (err) throw err;
        });
        imagenes.forEach((imagen) => {
            fs.rename(imagen.path, path.join(rutaImagenes, imagen.originalname), (err) => {
                if (err) throw err;
            });
        });
        fs.rename(juego.path, path.join(rutaJuego, juego.originalname), (err) => {
            if (err) throw err;
        });

        
        fs.writeFileSync(path.join(rutaBase+"/juego", 'informacion.json'), JSON.stringify(infoJuego, null, 2), 'utf8');


        res.send('Datos recibidos y archivos guardados correctamente.');
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send('Error al procesar la solicitud.');
    }
});

router.get('/todosLosTags', async (req, res) => {
    try {
        // Referencia a la colección 'tags'
        const tagsRef = db.collection('tags');
        // Recupera todos los documentos de la colección 'tags'
        const snapshot = await tagsRef.get();

        // Verifica si la colección está vacía
        if (snapshot.empty) {
            res.json({ tags: [] }); // Devuelve un arreglo vacío si no hay tags
            return;
        }

        const tags = [];
        snapshot.forEach(doc => {
            // Agrega el id del documento (el nombre del tag en este caso) al arreglo tags
            tags.push(doc.id);
        });

        res.json({ tags }); // Envía la lista de tags
    } catch (error) {
        console.error('Error al obtener los tags:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;