# Helsinki city bike app (Dev Academy pre-assignment)

### Download the requirements

1. Download these datasets of the journey:

- <https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv>
- <https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv>
- <https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv>

2. Also, download the dataset that has information about Helsinki Region Transport’s (HSL) city bicycle stations.

- Dataset: <https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv>

### Starter

1. Create MongoDB credentials and acquire the database URL string.
2. Create `.env` file and add `DATABASE_URL='your-data-string'`.
   (Remember to add the password by replacing `<passowrd>`).
3. Move the csv files downloaded to `csv` folder.
4. In the root folder

- Run `npm i` to install all required dependencies.
- Run `npm run dedup` to remove all the dupped lines in the files.
- Run `npm run import` to auto import 'clean' files to database.

## Stuff to do

- Good documentation (readme/other docs)
- Proper git usage (small commits, informative commit messages)
- Tests
- Getting features complete
- Writing good code

### Data import

#### Recommended

- [x] Import data from the CSV files to a database or in-memory storage
- [x] Validate data before importing
- [x] Don't import journeys that lasted for less than ten seconds
- [x] Don't import journeys that covered distances shorter than 10 meters

### Journey list view

#### Recommended

- List journeys
  - [x]If you don't implement pagination, use some hard-coded limit for the list length because showing several million rows would make any browser choke
- [x] For each journey show departure and return stations, covered distance in kilometers and duration in minutes

#### Additional

- [x] Pagination
- [x] Ordering per column
- [x] Searching
- [x] Filtering

### Station list

#### Recommended

- [x] List all the stations

#### Additional

- [x] Pagination
- [x] Searching

### Single station view

#### Recommended

- [x] Station name
- [x] Station address
- [x] Total number of journeys starting from the station
- [x] Total number of journeys ending at the station

#### Additional

- [x] Station location on the map
- [x] The average distance of a journey starting from the station
- [x] The average distance of a journey ending at the station
- [x] Top 5 most popular return stations for journeys starting from the station
- [x] Top 5 most popular departure stations for journeys ending at the station
- [x] Ability to filter all the calculations per month

## Surprise us with

- [x] Endpoints to store new journeys data or new bicycle stations
- [x] Running backend in Cloud
- [x] Create UI for adding journeys or bicycle stations
- Implement E2E tests
- Running backend in Docker
