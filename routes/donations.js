const express = require('express');
const router = express.Router();

// Path file-system
const playersJson = "/alirdb/player.json";
const fileEncrypt = "utf8";

/**
 *   GET List by donor !=1
 *   @param: req = Url della richiesta
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/lists/donor/1 --> [{....}]
 */

router.get('/donor/1', (req, res, next) => {

    fs.readFile(playersJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            let level = "5";
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*donorlevel=1]', {data: obj, allowRegexp: false}).value;
            // Lancio il risultato

            res.send(result);

        }
    });
});

/**
 *   GET List by donor !=2
 *   @param: req = Url della richiesta
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/lists/donor/2 --> [{....}]
 */

router.get('/donor/2', (req, res, next) => {

    fs.readFile(playersJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            let level = "5";
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*donorlevel>=2]', {data: obj, allowRegexp: false}).value;
            // Lancio il risultato

            res.send(result);

        }
    });
});

/**
 *   GET Donor stats
 *   @param: req = Url della richiesta
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/donor/stats --> [{"onelev": int,"twolev": int}]
 */

router.get('/stats', (req, res, next) => {

    fs.readFile(playersJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);

            let leve1 = jsonQuery('rows[**][*donorlevel=1]', {data: obj, allowRegexp: false}).value;
            let leve2 = jsonQuery('rows[**][*donorlevel>=2]', {data: obj, allowRegexp: false}).value;

            let onelenght = leve1.length;
            let twolenght = leve2.length;

            res.send({"onelev": onelenght, "twolev": twolenght});

        }
    });
});

module.exports = router;
