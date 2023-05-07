# API Docs

## Journeys

### Fetch journey

_**Endpoint**_

```
GET /api/journey
```

_**Example request**_

```
data: {
  'Departure station name': 'Pasila asema',
  'Return station name': 'Kamppi',
  page: 1
}
```

_**Example response**_

```
{
  "data": [
    {
      "lastPage": 7,
      "nextPage": {
          "page": 2,
          "limit": 10
      },
      "journeys": [
        {
          "_id": "6453aa5751fcb4ef9731eb06",
          "Departure": "2021-07-30T21:55:44",
          "Return": "2021-07-30T22:00:37",
          "Departure station id": "007",
          "Departure station name": "Pasila asema",
          "Return station id": "007",
          "Return station name": "Kamppi",
          "Covered distance (m)": 818,
          "Duration (sec)": 289,
          "__v": 0
        }
      ]
    }
  ]
}
```

### Add journey

_**Endpoint**_

```
POST /api/add-journey
```

_**Example request**_

```
data: {
    "Departure": "2023-05-07T18:09:17.325Z",
    "Return": "2023-05-07T18:14:01.089Z",
    "Departure station name": "Pasila asema",
    "Departure station id": "007",
    "Return station name": "Kamppi",
    "Return station id": "906",
    "Covered distance (m)": 842,
    "Duration (sec)": 242
}
```

_**Example response**_

```
data: {
  message: "Journey created succesfully"
}
```

### Calculate routes

_**Endpoint**_

```
/api/get-routes
```

_**Example request**_

```
data: {
  departure:[60.170,24.213],
  destination:[60.170,24.254]
}
```

**Example response**

```
{
  "legs": [
    {
        "duration": 1002,
        "distance": 3963.0289999999973
    },
    {
        "duration": 13,
        "distance": 7.962
    },
    {
        "duration": 1086,
        "distance": 3740.4980000000005
    }
  ]
}
```

## Stations

### Fetch all stations

_**Endpoint**_

```
GET /api/station
```

**Example response**

```
{
  "data": [
    "message": "Data fetched succesfully",
    {
      "_id": "6453aa4da44acbb9a0fc0d81",
      "FID": 1,
      "ID": 501,
      "Nimi": "Hanasaari",
      "Namn": "Hanaholmen",
      "Name": "Hanasaari",
      "Osoite": "Hanasaarenranta 1",
      "Adress": "Hanaholmsstranden 1",
      "Kaupunki": "Espoo",
      "Stad": "Esbo",
      "Operaattor": "CityBike Finland",
      "Kapasiteet": 10,
      "x": 24.840319,
      "y": 60.16582,
      "__v": 0
    },
  ]
}
```

### Fetch station details

_**Endpoint**_

```
GET /api/station-details
```

_**Example request**_

```
{data: stationId}
```

**Example response**

```
{
    "data": {
      "stationId": 501,
      "numStationsAtStart": 2371,
      "numStationsAtDest": 2440,
      "averageDistanceAtStart": 3799.8671446646986,
      "averageDistanceAtDest": 3692.4118852459014,
      "returnTop5Start": [
        {
            "name": "Koivusaari metro station",
            "occurrences": 188,
            "capacity": 16,
            "address": "Sotkatie 11",
            "x": 24.8551642686834,
            "y": 60.1633863116225
        },
        {
            "name": "Lauttasaari Shopping Center",
            "occurrences": 123,
            "capacity": 26,
            "address": "Lauttasaarentie 26",
            "x": 24.8828103623042,
            "y": 60.1604153459526
        },
       ...
    ],
    "returnTop5End": [
        {
            "name": "Koivusaari metro station",
            "occurrences": 201,
            "capacity": 16,
            "address": "Sotkatie 11",
            "x": 24.8551642686834,
            "y": 60.1633863116225
        },
        {
            "name": "Puistokaari",
            "occurrences": 121,
            "capacity": 16,
            "address": "Isokaari 30",
            "x": 24.8620200832623,
            "y": 60.1578749328793
        },
       ...
    ]
  }
}
```

### Station name search

_**Endpoint**_

```
/api/station-search
```

_**Example request**_

```
{
  data: 'Pasila asema'
}
```

**Example response**

```
data: [
 {
    "_id": "6453aa4da44acbb9a0fc0df5",
    "FID": 117,
    "ID": 7,
    "Nimi": "Designmuseo",
    "Namn": "Designmuseet",
    "Name": "Design Museum",
    "Osoite": "Korkeavuorenkatu 23",
    "Adress": "Högbergsgatan 23",
    "Kaupunki": " ",
    "Stad": " ",
    "Operaattor": " ",
    "Kapasiteet": 14,
    "x": 24.9459599998806,
    "y": 60.16310319166,
    "__v": 0
  },
  {
    "_id": "645564bef3b9f313d7e00885",
    "FID": 406,
    "ID": 903,
    "Nimi": "Desiro",
    "Namn": "Desiro",
    "Name": "Desiro",
    "Osoite": " Vallila, Helsinki,00520",
    "Adress": " Vallila, Helsinki,00520",
    "Kaupunki": "Uusimaa",
    "Stad": "Uusimaa",
    "Operaattor": "CityBike Finland",
    "Kapasiteet": 10,
    "x": 24.941766,
    "y": 60.194175,
    "__v": 0
  },
]
```

### Station name search extended

_**Endpoint**_

```
/api/station-search-ext
```

_**Example request**_

```
{
  data: 'Pasila asema'
}
```

**Example response**

```
data: [
    {
        "coordinates": [
            24.931183,
            60.168853
        ],
        "label": "Kamppi",
        "Name": "Kamppi (metroasema), Kamppi, Helsinki",
        "postalcode": "00100",
        "region": "Uusimaa"
    },
    {
        "coordinates": [
            24.932058,
            60.169119
        ],
        "label": "Kamppi",
        "Name": "Kamppi (bussipysäkki), Kamppi, Helsinki",
        "postalcode": "00100",
        "region": "Uusimaa"
    },
   ...
]
```

### Add Station

_**Endpoint**_

```
/api/add-station
```

_**Example request**_

```
{
  "Nimi": "Kamppi",
  "Name": "Kamppi",
  "Namn": "Kamppi",
  "Osoite": "Kamppi",
  "Adress": "Kamppi",
  "Kaupunki": "Uusimaa",
  "Stad": "Uusimaa",
  "Operaattor": "CityBike Finland",
  "Kapasiteet": 41,
  "x": 24.932058,
  "y": 60.169119
}
```

**Example response**

```
data: {
  message: "Station created succesfully"
}
```

### Station address lookup

_**Endpoint**_

```
/api/address-lookup
```

_**Example request**_

```
{
 position: [24.938311,60.187904]
}
```

**Example response**

```
data: {
  {
    "coordinates": [
        24.938311,
        60.187904
    ],
    "Name": "Tivolitie 12, Helsinki",
    "postalcode": "00510",
    "label": "Tivolitie 12",
    "region": "Uusimaa"
}
}
```

## Statistics

### Statistics - Basic

_**Endpoint**_

```
/api/statistic-basic
```

_**Example request**_

```
data: {
 '2021-05'
}
```

**Example response**

```
{
  "_id": "2021-05",
  "totalDuration": 409004565,
  "averageDuration": 1041.6544165399632,
  "totalDistance": 1004112939.67,
  "averageDistance": 2557.278739204735,
  "count": 392649
}
```

### Statistics - Station

_**Endpoint**_

```
/api/statistic-station
```

_**Example request**_

```
data: {
 '2021-05'
}
```

**Example response**

```
{
  busiestStations:
  [
    {
      "station": "Itämerentori",
      "count": 6678
    },
    {
      "station": "Kalasatama (M)",
      "count": 5284
    },
    {
      "station": "Pasilan asema",
      "count": 5154
    },
    {
      "station": "Ympyrätalo",
      "count": 4953
    },
    ...
  ]

}
```

### Statistics - Route

_**Endpoint**_

```
/api/statistic-route
```

_**Example request**_

```
data: {
 '2021-05'
}
```

**Example response**

```
{
  popularRoutes:
  [
      {
          "count": 28,
          "month": "2021-05",
          "route": "Koskelan varikko - Intiankatu"
      },
      {
          "count": 14,
          "month": "2021-05",
          "route": "Juhana Herttuan tie - Pasilan asema"
      },
      {
          "count": 6,
          "month": "2021-05",
          "route": "Narinkka - Rajasaarentie"
      },
  ]
}
```