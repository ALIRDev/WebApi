const express = require('express');
const router = express.Router();

const userJson = process.env.USER_JSON;
const fileEncr = process.env.FILE_ENCRYPTION;

/**
 *   GET Users by pid
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/users/76561198037236088 --> [{steamid: "76561198037236088", ....}]
 */

router.get("/users/:steamid", (req, res, next) => {

    // Prendo il pid dalla richiesta
    const steamid = req.params.steamid;

    fs.readFile( userJson, fileEncr, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*steamid=' + steamid + ']', {data: obj, allowRegexp: false}).value;
            // Lancio il risultato

            if (result.length > 0) {
                res.send(result);

            } else {
                res.send({404: "Nessun utente trovato"});

            }
        }
    });
});

/**
 *   GET Users lenght
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/users/lenght --> [{56}]
 */

router.get("/users/lenght/", (req, res, next) => {

    fs.readFile(userJson, fileEncr, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][]', {data: obj}).value;
            // Lancio il risultato

            let lenght = result.length;

            res.send({size: lenght});


        }
    });
});

/**
 *   GET Users by id
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/users/id/3 --> [{id: "3", ....}]
 */

router.get("/users/id/:id", (req, res, next) => {

    // Prendo il pid dalla richiesta
    const id = req.params.id;

    fs.readFile(userJson, fileEncr, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*id=' + id + ']', {data: obj, allowRegexp: false}).value;
            // Lancio il risultato

            if (result.length > 0) {
                res.send(result);

            } else {
                res.send({404: "Nessun utente trovato"});

            }
        }
    });
});

module.exports = router;
