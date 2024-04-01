const express = require('express');
const router = express.Router();
const { admin }= require('../firebase'); // Asegúrate de que Firebase Admin esté inicializado correctamente en alguna parte de tu código

// Endpoint para registrar un nuevo usuario
router.post('/r', async (req, res) => {
  try {
    // Registro del usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: req.body.email,
      password: req.body.password,
    });

    // Referencia al documento del usuario en Firestore
    const userDocRef = admin.firestore().collection('users').doc(req.body.email);
    
    // Insertar detalles del usuario en Firestore
    await userDocRef.set({
      ELObyGame: {},
      admin: false,
      developer: false,
      email: req.body.email,
      exp: 0,
      level: 0, 
      name: req.body.username,
      password: req.body.password,
      pointsByGame: {},
      replyByGame: {},
      saldo: 0.0, 
      surname: "surnameEjemplo",
      username: req.body.username,
      // Aquí puedes agregar más campos según tu modelo de datos
    });

    await userDocRef.collection('achievementsByGame').doc('initialDoc').set({});
    await userDocRef.collection('chats').doc('initialDoc').set({});

    res.status(201).send({ message: 'Usuario registrado con éxito.', uid: userRecord.email });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send({ message: 'Error al registrar usuario.', error: error.message });
  }
});

// Verificación del token de ID para una sesión segura
router.post('/l', (req, res) => {
  const idToken = req.body.idToken;
  
  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      const uid = decodedToken.uid;
      // La verificación del token fue exitosa, el usuario está autenticado
      // Realiza acciones en nombre del usuario aquí, si es necesario
      res.status(200).send({ uid: uid });
    })
    .catch(error => {
      // Manejo de errores
      res.status(401).send(error);
    });
});
module.exports = router;
