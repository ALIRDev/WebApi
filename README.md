# ALIRAPI

## Introduzione

AlirAPI è un'applicativo node.js, che espone delle api sulla porta 8000 di seguito l'elenco:

## Richieste

Rotte esposte dall'app Node.js ALIRWebApi, richiesta BasicAuth dalla versione donor

#### Richieste ALIRDB

###### GET Check status

Verifica di stato del sistema, se online la risposta è ok: Sistema Online!

```
http://192.168.30.77:8000/status
```

###### GET Players by playerid

Richiedo un giocatore tramite il suo playerid.

```
http://192.168.30.77:8000/players/76561197960737527
```

###### GET Players by name

Richiedo un giocatore tramite il suo nome.

```
http://192.168.30.77:8000/players/name/Mat
```
###### GET Vehicles by pid

Richiedo i veicoli di un determinato pid.

```
http://192.168.30.77:8000/vehicles/76561197960737527
```

###### GET Gangs by members

Richiedo il nome della gang avendo l'id di uno dei suoi members.

```
http://192.168.30.77:8000/gangs/id/76561198037236088
```

###### GET Gangs by name

Richiedo una gang avendo il nome.

```
http://192.168.30.77:8000/gangs/Wild
```

###### GET Wanted by wantedid 

Richiedo i capi d'accusa di un'utente dal suo playerid.

```
http://192.168.30.77:8000/wanted/76561197960737527
```

###### GET Users by steamId

Richiedo un'utente del forum tramite il suo steamId.

```
http://192.168.30.77:8000/users/76561198037236088
```

###### GET Lists med

Richiedo l'elenco dei medici al server.

```
http://192.168.30.77:8000/lists/med
```

###### GET Lists cop

Richiedo l'elenco cop al server.

```
http://192.168.30.77:8000/lists/cop
```

#### Richieste MyALIR

###### GET donators

Richiedo la collection donor del db mongo (database alirdb) per la visualizzazione della lista donatori

```
http://192.168.30.77:8000/donations
```
###### GET donator by id

Richiedo il donatore tramite il suo userId univoco (InvisioPower)

```
http://192.168.30.77:8000/donations/id?userId=7 --> [...]
```

###### PUT donator by id

Aggiorno un donatore nella collections donor tramite il suo _id mongo nel db alirdb, richiede la trasmissione dell'intero donatore al fine dell'aggiornamento corretto del donatore

```
http://192.168.30.77:8000/donations?id=5a8ede5ca4871826a30bd27a&userId=7&donationDate=2016-05-18T16:00:00Z&expirationDate=2016-05-18T16:00:00Z&userSteamId=76561197971046908&donationAmount=5
```

###### POST donators

Aggiungo un donatore nella collections donor del db mongo (database alirdb)

```
http://192.168.30.77:8000/donations?userId=7&donationDate=2016-05-18T16:00:00Z&expirationDate=2016-05-18T16:00:00Z&userSteamId=76561197971046908&donationAmount=5
```

#### Richieste Steam

###### DELETE Delete donator by id

Rimuovo un donatore dalla collections donor su MongoDB (database alirdb) tramite il suo _id mongo

```
http://192.168.30.77:8000/donations?id=5a8ede5ca4871826a30bd27a
```

###### GET Achievements by appId

Ottengo la lista dei trofei di un determinato gioco tramite appId

```
http://192.168.30.77:8000/steam/game/8930/achievements
```

###### GET User ban by steamId

Ottengo i ban a carico di un'utente dallo steamID

```
http://192.168.30.77:8000/steam/users/76561197960435530/ban
```

###### GET User data by steamId

Ottengo i dati principali di un'utente dallo steamID

```
http://192.168.30.77:8000/steam/users/76561197960435530/data
```

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