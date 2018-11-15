const fs             = require("file-system");
const jsonQuery      = require('json-query');

const gangsJson             = "/home/andreacw/webapi/today/gangs.json";
const fileEncrypt           = "utf8";

module.exports = function (app) {

    /**
     *   GET Gangs lenght
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8190/gangs/lenght --> [{56}]
     */

    app.get("/gangs/lenght/", (req, res, next) => {

        fs.readFile(gangsJson, fileEncrypt, function (err, data) {
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
     *   GET All Gangs (LIMITER 75)
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8190/gangs --> [{..},{..}]
     */

    app.get("/gangs/", (req, res, next) => {

        fs.readFile(gangsJson, fileEncrypt, function(err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});

            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);

                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato
                let array = [];

                for (let index = 0; index < result.length; index++) {
                    let element = result[index];
                    if (index < 75) {
                        array.push(element);
                    }
                }

                res.send(array);

            }
        });

    });

    /**
     *   GET Gangs by name
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8190/gangs/Mano --> [{name: "Mano nera", ....}]
     */

    app.get("/gangs/:name", (req, res, next) => {

        // Prendo il nome dalla richiesta
        const gangName = req.params.name;

        fs.readFile(gangsJson, fileEncrypt, function(err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});

            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*name~/^' + gangName + '/i]',
                    {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if (result.length > 0) {
                    res.send(result);

                } else {

                    res.send({404: "not found"});

                }
            }
        });

    });

    /**
     *   GET Gangs by pid
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8190/gangs/id/76561197960737527 --> [{name: "Mano nera", ....}]
     */

    app.get("/gangs/id/:playerid", (req, res, next) => {

        // Prendo il nome dalla richiesta
        const playerid = req.params.playerid;

        fs.readFile(gangsJson, fileEncrypt, function(err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});

            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]',
                    {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                let finalName;

                for (let i = result.length - 1; i >= 0; i--) {

                    let subval = result[i].name;
                    let subres = result[i];

                    for (let y = subres.members.length - 1; y >= 0; y--) {

                        if (subres.members[y] === playerid) {
                            finalName = subres;

                            // impedisco ulteriori risultati
                            break;
                        }
                    }

                }

                let arrayMaker = [finalName];

                res.send(arrayMaker);
            }

        });

    });

};
