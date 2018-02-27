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