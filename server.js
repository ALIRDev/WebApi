const express        = require('express');
const ip             = require("ip");
const app            = express();
const routes         = require('./app/api_routes');
const https          = require('https');
const fs             = require("file-system");

const options = {
    key: fs.readFileSync('/home/andreacw/key.pem'),
    cert: fs.readFileSync('/home/andreacw/certificate.pem')
};

//app.use(express.static('static'));

https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
}).listen(8001);

const port = 8000;
const HOST = ip.address();

app.listen(port, HOST);
console.log(`Running on http://${HOST}:${port}`);

routes(app);



