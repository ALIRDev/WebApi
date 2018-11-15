const fs = require("file-system");
const jsonQuery = require('json-query');

const wantedJson = "/home/andreacw/webapi/today/wanted.json";
const fileEncrypt = "utf8";

module.exports = function(app) {

    /**
     *   GET Wanted lenght
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8190/wanted/lenght --> [{56}]
     */

    app.get("/wanted/lenght/", (req, res, next) => {

        fs.readFile(wantedJson, fileEncrypt, function (err, data) {
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

    app.get("/wanted/:wantedID", (req, res, next) => {

        // Prendo il pid dalla richiesta
        const wantedID = req.params.wantedID;

        fs.readFile(wantedJson, fileEncrypt, function (err, data) {
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

};
