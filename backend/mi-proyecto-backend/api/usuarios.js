const express = require('express');
const router = express.Router();

router.get('/login2', (req, res) => {
  res.send('Ruta de usuarios');
});

module.exports = router;