const fs = require("file-system");
const request = require('request');

const fileEncrypt = "utf8";
const discussioniJson = "/home/andreacw/webapi/discussioni.json";
const annunciJson = "/home/andreacw/webapi/annunci.json";

module.exports = function(app) {

    /**
     *   GET Arma 3 server info
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/server/data --> [{"...."}]
     */

    const armaServerURL = "https://arma3-servers.net/api/";
    const keyA3S = "bcdzrsb2sy4nfdpb3w9g2fk7f5kqre04c2k";

    app.get("/server/data", function(req, res, next) {
        let url = armaServerURL + "?object=servers&element=detail&key=" + keyA3S;
        request.get(url, function(error, httpResponse, httpBody) {
            res.setHeader('Content-Type', 'application/json');
            res.send(httpBody);
        });
    });

    // RICHIESTE RSS

    app.get("/rssFeed/discussioni", (req, res, next) => {

        fs.readFile(discussioniJson, fileEncrypt, function(err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});

            } else {
                let obj = JSON.parse(data);
                res.send(obj);
            }
        });

    });

    app.get("/rssFeed/annunci", (req, res, next) => {

        fs.readFile(annunciJson, fileEncrypt, function(err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});

            } else {
                let obj = JSON.parse(data);
                res.send(obj);
            }
        });
    });

};
