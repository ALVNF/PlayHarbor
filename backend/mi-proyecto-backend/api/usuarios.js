const express = require('express');
const router = express.Router();
const { admin }= require('../firebase'); // Asegúrate de que Firebase Admin esté inicializado correctamente en alguna parte de tu código

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

module.exports = router;