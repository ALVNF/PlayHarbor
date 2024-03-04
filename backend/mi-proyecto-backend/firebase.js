const admin = require('firebase-admin');
const serviceAccount = require('./duck-team-firebase-adminsdk-e0smk-4ac453f97c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://duck-team.appspot.com"
});

const db = admin.firestore();
const storage = admin.storage();
// Exporta ambos objetos
module.exports = {admin, db, storage};


  