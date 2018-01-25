# ALIRAPI

## Introduzione

AlirAPI è un'applicativo node.js, che espone delle api sulla porta 8000 di seguito l'elenco:

## GET Request

Elenco delle richieste possibili sulla porta 8000.

#### GET /

Ottieni lo stato di attività

#### GET /players/:playerid

Ricerca tra i giocatori per playerid

#### GET /players/name/:name

Ricerca tra i giocatori per nome 

#### GET /vehicles/:pid

Ricerca dei veicoli per pid (playerid)

#### GET /wanted/:wantedid

Ricerca tra i ricercati per wantedID.

#### GET /gangs

Ottieni l'elenco di tutte le gang sul database.

#### GET /gangs/:name

Ricerca per nome tra le gang.

#### GET /users/:steamId

Ricerca per steamId tra gli utenti del forum.