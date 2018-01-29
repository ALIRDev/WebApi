const express        = require('express');
const ip             = require("ip");
const app            = express();
const routes         = require('./app/api_routes');

const port = 8000;
const HOST = ip.address();

app.listen(port, HOST);



let weblogo ="\n" +
    "\n" +
    "           _      _____ _____   __          __  _                   _ \n" +
    "     /\\   | |    |_   _|  __ \\  \\ \\        / / | |      /\\         (_)\n" +
    "    /  \\  | |      | | | |__) |  \\ \\  /\\  / /__| |__   /  \\   _ __  _ \n" +
    "   / /\\ \\ | |      | | |  _  /    \\ \\/  \\/ / _ \\ '_ \\ / /\\ \\ | '_ \\| |\n" +
    "  / ____ \\| |____ _| |_| | \\ \\     \\  /\\  /  __/ |_) / ____ \\| |_) | |\n" +
    " /_/    \\_\\______|_____|_|  \\_\\     \\/  \\/ \\___|_.__/_/    \\_\\ .__/|_|\n" +
    "                                                             | |      \n" +
    "                                                             |_|      \n" +
    "\n"+
    "=========================================================================\n";

console.log(weblogo);

console.log(`In esecuzione su http://${HOST}:${port}`);

console.log(`Effettua una GET su http://${HOST}:${port}/ per ottenere lo stato del servizio`);

routes(app);