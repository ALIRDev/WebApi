const express = require('express');
const router = express.Router();


// TODO

/**
 * GESTIONE DEGLI UTENTI
 *
 * Mi salvo i dati degli utenti ogni 30 min in locale, verifico che dispongano di uno SteamID64 (76561197960287930) valido
 * se l'id è valido e 64 lo salvo con i dati, altrimenti converto uno steam id di un'altro formato in 64. Se non è inserito cancello l'utenza.
 *
 * */


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
