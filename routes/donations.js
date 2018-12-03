const express = require('express');
const router = express.Router();

    const playerJson = process.env.PLAYER_JSON;

/**
 *   GET List by donor !=1
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/lists/donor/1 --> [{....}]
 */

router.get("/lists/donor/1", (req, res, next) => {

    fs.readFile(playerJson, process.env.FILE_ENCRYPTION, function (err, data) {
        if (err) {
            res.send({500: "Errore durante la richiesta"});

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
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/lists/donor/2 --> [{....}]
 */

router.get("/lists/donor/2", (req, res, next) => {

    fs.readFile(playerJson, process.env.FILE_ENCRYPTION, function (err, data) {
        if (err) {
            res.send({500: "Errore durante la richiesta"});

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
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/donor/stats --> [{"onelev": int,"twolev": int}]
 */

router.get("/donor/stats", (req, res, next) => {

    fs.readFile(playerJson, process.env.FILE_ENCRYPTION, function (err, data) {
        if (err) {
            res.send({500: "Errore durante la richiesta"});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);

            let leve1 = jsonQuery('rows[**][*donorlevel=1]', {data: obj, allowRegexp: false}).value;
            let leve2 = jsonQuery('rows[**][*donorlevel>=2]', {data: obj, allowRegexp: false}).value;

            let onelenght = leve1.length;
            let twolenght = leve2.length;

            res.send({"onelev": onelenght,"twolev": twolenght});

        }
    });
});

module.exports = router;
