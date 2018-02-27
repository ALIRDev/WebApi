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

###### DELETE Delete donator by id

Rimuovo un donatore dalla collections donor su MongoDB (database alirdb) tramite il suo _id mongo

```
http://192.168.30.77:8000/donations?id=5a8ede5ca4871826a30bd27a
```