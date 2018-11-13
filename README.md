# ALIRAPI
[![Maintainability](https://api.codeclimate.com/v1/badges/f86e5d82069e0dd07738/maintainability)](https://codeclimate.com/github/andreacw5/ALIRWebApi/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f86e5d82069e0dd07738/test_coverage)](https://codeclimate.com/github/andreacw5/ALIRWebApi/test_coverage)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ae27cc41a3c84d939ead417373cdd573)](https://app.codacy.com/app/andreacw5/ALIRWebApi?utm_source=github.com&utm_medium=referral&utm_content=andreacw5/ALIRWebApi&utm_campaign=Badge_Grade_Settings)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fandreacw5%2FALIRWebApi.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fandreacw5%2FALIRWebApi?ref=badge_shield)

## Introduzione

AlirAPI è un'applicativo node.js, che espone delle api sulla porta 8190 di seguito l'elenco:

## Richieste

Rotte esposte dall'app Node.js ALIRWebApi, richiesta BasicAuth dalla versione donor

#### Richieste ALIRDB

È possibile trovare tutte le informazioni sulle request per ALIRDB [qui](docs/ALIRDBRequest.md)

#### Richieste MyALIR

È possibile trovare tutte le informazioni sulle request per MyALIR [qui](docs/MyALIRequest.md)

#### Richieste Steam

È possibile trovare tutte le informazioni sulle request per Steam [qui](docs/SteamRequest.md)

#### Richieste RssFeed

È possibile trovare tutte le informazioni sulle request per RssFeed [qui](docs/FeedNews.md)

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

### License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fandreacw5%2FALIRWebApi.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fandreacw5%2FALIRWebApi?ref=badge_large)
