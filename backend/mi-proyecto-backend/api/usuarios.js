const express = require('express');
const router = express.Router();
const { admin }= require('../firebase'); // Asegúrate de que Firebase Admin esté inicializado correctamente en alguna parte de tu código
const { db } = require('../firebase'); // Importa db desde firebase.js

//getInfoUsuario usa esta ruta para conseguir el token y obtener el usuario
router.get('/infoUsuario', (req, res) => {
  const idToken = req.headers.authorization.split('Bearer ')[1];
  
  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      const userEmail = decodedToken.email;
      // Ahora busca en Firestore usando el correo electrónico
      return admin.firestore().collection('users').where('email', '==', userEmail).get();
    })
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        return res.status(404).send('Usuario no encontrado');
      }
      // Suponiendo que el correo electrónico es único y solo devuelve un documento
      let userData;
      querySnapshot.forEach(doc => {
        userData = doc.data();
      });
      return res.status(200).send(userData);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

router.put('/updateUserInfo', async (req, res) => {
  
  try {
    const userEmail = req.body.email; // Asegúrate de que el email del usuario viene en la petición
    const userUpdates = {
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username
      // Agrega más campos según sea necesario
    };
    
    // Actualizar en Firestore
    await admin.firestore().collection('users').doc(userEmail).update(userUpdates);

    res.json({ message: 'Información del usuario actualizada con éxito.' });
  } catch (error) {
    console.error('Error al actualizar la información del usuario:', error);
    res.status(500).json({ message: 'Error al actualizar la información del usuario.', error: error.message });
  }
});

/*Recupera los puntos del jugador/jugadores de la plataforma/juegos*/
router.get('/getPuntosJug', async (req, res) => {
  try {
    var puntosD = req.query.puntosD;
    
    let puntos;

    if (puntosD == "plataforma") {
      puntos = await getPuntosPlataforma();
    } else if (puntosD == "juegos") {
      var tipoM = req.query.tipoM //Tipo de partida
      puntos = await getPuntosJuegos(tipoM);
    } else {
      throw new Error("Tipo de puntosD desconocido");
    }

    res.json(puntos);
  } catch (error) {
    console.error("Error al recuperar los puntos del jugador/jugadores:", error);
    res.status(500).send("Error al recuperar los puntos del jugador/jugadores");
  }
});

/*Recupera los puntos de todos los usuarios para todos los juegos, en front ya se recupera usu actual*/
async function getPuntosJuegos(tipoM) {
  const puntosTotalesPorJuego = {};
  try {
    const juegosSnapshot = await db.collection("games").get();
    if (juegosSnapshot.empty) {
      console.log("No existen juegos");
    }

    //Itera sobre cada juego
    for (const juegoDoc of juegosSnapshot.docs) {
      const juegoId = juegoDoc.id;

      puntosTotalesPorJuego[juegoId] = {};

      //Obtiene los partidos del juego actual
      const partidosSnapshot = await juegoDoc.ref.collection("matches").where("type", "==", tipoM).get();

      //Itera sobre cada partido
      for (const partidoDoc of partidosSnapshot.docs) {
        // Obtiene los equipos del partido actual
        const equiposSnapshot = await partidoDoc.ref.collection("teams").get();

        //Itera sobre cada equipo
        for (const equipoDoc of equiposSnapshot.docs) {
          //Obtiene los puntajes del equipo actual
          const puntajesSnapshot = await equipoDoc.ref.collection("scores").get();
          for (const personaDoc of puntajesSnapshot.docs) {
            var jugadorId = personaDoc.id;
            var puntos = personaDoc.data().finalPoints
            if (!puntosTotalesPorJuego[juegoId][jugadorId]) {
              puntosTotalesPorJuego[juegoId][jugadorId] = 0;
            }

            puntosTotalesPorJuego[juegoId][jugadorId] += puntos;
          }
        }
      }
    }

    return puntosTotalesPorJuego;
  } catch (error) {
    console.error("Error al obtener los puntos por juego:", error);
    throw error;
  }
}

/*Recupera los puntos de todos los usuarios para la plataforma, en front ya se recupera usu actual*/
async function getPuntosPlataforma(){
  const pntsTorneos = await getPuntosJuegos("torneo");
  const pntsNormales = await getPuntosJuegos("normal");
  const puntosTotales = {};
  
  for (const juegoId in pntsTorneos) {
    for (const jugadorId in pntsTorneos[juegoId]) {
      if (!puntosTotales[jugadorId]) {
        puntosTotales[jugadorId] = 0;
      }
      puntosTotales[jugadorId] += pntsTorneos[juegoId][jugadorId] * 2;
    }
  }

  for (const juegoId in pntsNormales) {
    for (const jugadorId in pntsNormales[juegoId]) {
      if (!puntosTotales[jugadorId]) {
        puntosTotales[jugadorId] = 0;
      }
      puntosTotales[jugadorId] += pntsNormales[juegoId][jugadorId];
    }
  }
  return puntosTotales;
}

module.exports = router;