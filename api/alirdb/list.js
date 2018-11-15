const fs = require("file-system");
const jsonQuery = require('json-query');

const fileEncrypt = "utf8";
const playersJson = "/home/andreacw/webapi/today/player.json";

module.exports = function(app) {

    /**
     *   GET List by cop
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8190/lists/cop --> [{coplevel: "3", ....}]
     */

    app.get("/lists/cop/", (req, res, next) => {

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});

            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                let level = "5";
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*coplevel!=0]', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                res.send(result);

            }
        });
    });

    /**
     *   GET List by med
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8190/lists/med --> [{mediclevel: "3", ....}]
     */

    app.get("/lists/med/", (req, res, next) => {

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});

            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                let level = "5";
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*mediclevel!=0]', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                res.send(result);

            }
        });
    });
};
