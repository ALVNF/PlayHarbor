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
app.use('/api', usuariosRutas);
app.use('/api', authRutas);
app.use('/api', juegosRutas);
// Cargar clave privada y certificado para HTTPS
const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'server.cert'), 'utf8');

app.get('/', (req, res) => {
  //res.sendFile(__dirname + '/frontend/index.html');
  res.sendFile(__dirname + '/frontend/pages/descriptionGame.html');
});

// app.get('/register', (req, res) => {
//   res.sendFile(__dirname + '/frontend/register.html');
// });
// app.get('/login', (req, res) => {
//   res.sendFile(__dirname + '/frontend/login.html');
// });
// app.get('/profile', (req, res) => {
//   res.sendFile(__dirname + '/frontend/profile.html');
// });

// Crear un servidor HTTPS
const httpsServer = https.createServer({
  key: privateKey,
  cert: certificate
}, app);

httpsServer.listen(port, () => {
  console.log(`Server listening at https://localhost:${port}`);
});
