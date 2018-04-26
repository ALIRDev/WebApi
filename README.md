# ALIRAPI

## Introduzione

AlirAPI è un'applicativo node.js, che espone delle api sulla porta 8000 (Versione stabile) o 3000 (Pre-Release) di seguito l'elenco:

## Richieste

Rotte esposte dall'app Node.js ALIRWebApi, richiesta BasicAuth dalla versione donor

#### Richieste ALIRDB

È possibile trovare tutte le informazioni sulle request per ALIRDB [qui](docs/ALIRDBRequest.md)

#### Richieste MyALIR

È possibile trovare tutte le informazioni sulle request per MyALIR [qui](docs/MyALIRequest.md)

#### Richieste Steam

È possibile trovare tutte le informazioni sulle request per Steam [qui](docs/SteamRequest.md)

## Basic Auth

Per tutte le richieste a partire dalla versione Web Api 2

```javascript

function make_base_auth(user, pass) {
  let tok = user + ':' + pass;
  let hash = Base64.encode(tok);
  return "Basic " + hash;
}

let auth = make_base_auth('me','mypassword');
let url = 'http://example.com';

// jQuery
$.ajax({
    url : url,
    method : 'GET',
    beforeSend : function(req) {
        req.setRequestHeader('Authorization', auth);
    }
});

```
