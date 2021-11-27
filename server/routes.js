// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();
const push = require('./push');


// Almacenar la suscripción
router.post('/subscribe', (req, res) => {


  const suscripcion = req.body;

  
  push.addSubscription( suscripcion );


  res.json('subscribe');

});

// Almacenar la suscripción
router.get('/key', (req, res) => {

  const key = push.getKey();


  //res.json("Key publico");
 // res.json(key);

  res.send(key);

});


// Envar una notificación PUSH a las personas
// que nosotros queramos
// ES ALGO que se controla del lado del server
router.post('/push', (req, res) => {

  const post = {
    titulo: req.body.titulo,
    cuerpo: req.body.cuerpo,
    usuario: req.body.usuario
  };

  //console.log ( post );
  
  push.sendPush( post );


  //res.json("Enviar notificacion");

   res.json( post );

});





module.exports = router;