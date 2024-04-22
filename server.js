const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
//const { db } = require('./firebase'); // Importa db desde firebase.js

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static('frontend'));
app.use('/juegos', express.static('backend/juegos/revisados'));

const usuariosRutas = require('./backend/mi-proyecto-backend/api/usuarios');
const authRutas = require('./backend/mi-proyecto-backend/api/auth');
const juegosRutas = require('./backend/mi-proyecto-backend/api/juegos');
const juegosLogros= require('./backend/mi-proyecto-backend/api/logros');
const webJuegosRutas = require('./backend/mi-proyecto-backend/api/webSocket');

app.use('/api', usuariosRutas);
app.use('/api', authRutas);
app.use('/api', juegosRutas);
app.use('/api', juegosLogros);
app.use('/api', webJuegosRutas);

// Cargar clave privada y certificado para HTTPS
const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'server.cert'), 'utf8');

//Quitar cache 
app.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/pages/potato.html');
  //res.sendFile(__dirname + '/frontend/pages/descriptionGame.html');
});


// Crear un servidor HTTPS
const httpsServer = https.createServer({
  key: privateKey,
  cert: certificate
}, app);

httpsServer.listen(port, () => {
  console.log(`Server listening at https://localhost:${port}`);
});
