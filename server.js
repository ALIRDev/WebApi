const express        = require('express');
const ip             = require("ip");
const app            = express();
const routes         = require('./app/api_routes');
const basicAuth      = require('express-basic-auth');

const port = 8000;
const HOST = ip.address();

app.listen(port, HOST);

console.log("   ----  ALIR WebApi  ----   ");

console.log(`In esecuzione su http://${HOST}:${port}`);

function getUnauthorizedResponse(req) {
    return req.auth
        ? ('Credenziali ' + req.auth.user + ' respinte')
        : 'Nessuna credenziale fornita'
}

app.use(basicAuth({
    users: {
        // Utente di dev
        'admin':'password',
    },
    unauthorizedResponse: getUnauthorizedResponse
}));

// TODO: In base all'utente loggato disabilitare ed abilitare le richieste della sua sezione, es utente db non ha accesso alle request donazioni

routes(app);