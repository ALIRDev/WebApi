const express = require('express');
const router = express.Router();

/**
 *   GET Vehicle lenght
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/vehicles/lenght --> [{56}]
 */

router.get('/vehicles/lenght/', (req, res, next) => {

    fs.readFile(process.env.VEHICLE_JSON, process.env.FILE_ENCRYPTION, function(err, data) {
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
 *   GET Vehicles by pid
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/vehicles/76561197960737527 --> [{pid: '76561197960737527', ....}]
 */

router.get('/vehicles/:pid', (req, res, next) => {

    // Prendo il pid dalla richiesta
    const pid = req.params.pid;

    fs.readFile(process.env.VEHICLE_JSON, process.env.FILE_ENCRYPTION, function(err, data) {
        if (err) {

            res.send({500: 'Errore durante la richiesta'});

        } else {

            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*pid~/' + pid + '/i]', {data: obj, allowRegexp: true}).value;
            // Lancio il risultato

            if (err) {

                res.send({500: 'Errore'});

            }

            if (result.length > 0) {

                res.send(result);

            } else {

                res.send({404: 'Nessun veicolo trovato'});

            }
        }
    });
});

module.exports = router;
