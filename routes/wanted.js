const express = require('express');
const router = express.Router();

/**
 *   GET Wanted lenght
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/wanted/lenght --> [{56}]
 */

router.get("/wanted/lenght/", (req, res, next) => {

    fs.readFile(process.env.WANTED_JSON, process.env.FILE_ENCRYPTION, function (err, data) {
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
 *   GET Wanted by wantedID
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/wanted/76561197960737527 --> [{wantedID: "76561197960737527", ....}]
 */

router.get("/wanted/:wantedID", (req, res, next) => {

    // Prendo il pid dalla richiesta
    const wantedID = req.params.wantedID;

    fs.readFile(process.env.WANTED_JSON, process.env.FILE_ENCRYPTION, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*wantedID~/^' + wantedID + '/i]', {
                data: obj,
                allowRegexp: true
            }).value;
            // Lancio il risultato

            if (result.length > 0) {
                res.send(result);

            } else {
                res.send({404: "Nessun ricercato trovato"});
            }
        }
    });
});

module.exports = router;
