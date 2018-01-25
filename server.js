const express        = require('express');
const ip             = require("ip");
const app            = express();
const routes         = require('./app/api_routes');

const port = 8000;
const HOST = ip.address();

app.listen(port, HOST);
console.log(`Running on http://${HOST}:${port}`);

routes(app);