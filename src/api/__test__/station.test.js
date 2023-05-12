import { describe, test, expect, beforeAll, afterAll, it, afterEach, beforeEach } from 'vitest';
import supertest from 'supertest'
import server from '../../server.js'
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
dotenv.config()

const { DATABASE_URL, DB_NAME } = process.env;

describe('GET /get-station', () => {

  it('responds with "Stations fetched successfully"', async () => {
    const resp = await supertest(server)
      .get('/api/get-station')

    expect(resp.status).toBe(200)
    expect(resp.body).toHaveProperty('data');
    expect(resp.body.data).toBeInstanceOf(Array);

    expect(resp.body.message).to.equal('Stations fetched successfully');
  });
});


describe('POST /station-search', () => {

  it('should return an array of data objects with correct structure', async () => {

    const resp = await supertest(server)
      .post('/api/station-search')
      .send({
        data: 'Design Museum'
      })
    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty('data');
    expect(resp.body.data).toBeInstanceOf(Array);

    const data = resp.body.data;

    data.forEach((item) => {
      expect(item).toHaveProperty('_id');
      expect(item).toHaveProperty('FID');
      expect(item).toHaveProperty('ID');
      expect(item).toHaveProperty('Nimi');
      expect(item).toHaveProperty('Namn');
      expect(item).toHaveProperty('Name');
      expect(item).toHaveProperty('Osoite');
      expect(item).toHaveProperty('Adress');
      expect(item).toHaveProperty('Kaupunki');
      expect(item).toHaveProperty('Stad');
      expect(item).toHaveProperty('Operaattor');
      expect(item).toHaveProperty('Kapasiteet');
      expect(item).toHaveProperty('x');
      expect(item).toHaveProperty('y');
    });

    expect(data.length).toBeGreaterThan(0);

  });
})

describe('POST /station-search-ext', () => {

  it('should return an array of data objects with correct structure', async () => {
    const resp = await supertest(server)
      .post('/api/station-search-ext')
      .send({
        data: 'Kamppi'
      })

    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty('data');
    expect(resp.body.data).toBeInstanceOf(Array);

    const data = resp.body.data;

    data.forEach((item) => {
      expect(item).toHaveProperty('coordinates');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('Name');
      expect(item).toHaveProperty('postalcode');
      expect(item).toHaveProperty('region');

      expect(item.coordinates).toBeInstanceOf(Array);

    });
  });
})

describe('POST /station-details', () => {

  it('should return an array of data objects with correct structure', async () => {

    const resp = await supertest(server)
      .post('/api/station-details')
      .send({
        data: '501'
      })

    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty('data');

    const data = resp.body.data;

    expect(data).toHaveProperty('stationId');
    expect(data).toHaveProperty('numStationsAtStart');
    expect(data).toHaveProperty('numStationsAtDest');
    expect(data).toHaveProperty('averageDistanceAtStart');
    expect(data).toHaveProperty('averageDistanceAtDest');

    expect(data.returnTop5Start).toBeInstanceOf(Array);
    expect(data.returnTop5End).toBeInstanceOf(Array);
  })

}, 30000)


describe('POST /add-station', () => {
  let client;
  let db;

  beforeAll(async () => {
    // connect to the database
    client = await MongoClient.connect(DATABASE_URL);
    db = client.db(DB_NAME);
  });

  afterAll(async () => {
    // remove the data that was created during the tests
    await db.collection('stations').deleteMany({
      Name: { $in: ['Fedex'] }
    });

    // close the database connection
    await client.close();
  });


  it('should display message "Station is already taken" if station already exists', async () => {
    const stationData = {
      Nimi: "Kamppi",
      Name: "Kamppi",
      Namn: "Kamppi",
      Osoite: "Kamppi",
      Adress: "Kamppi",
      Kaupunki: "Uusimaa",
      Stad: "Uusimaa",
      Operaattor: "CityBike Finland",
      Kapasiteet: 41,
      x: 24.932058,
      y: 60.169119
    }
    const resp = await supertest(server)
      .post('/api/add-station')
      .send({ data: stationData })

    expect(resp.status).toBe(409);
    expect(resp.text).to.equal("Station is already taken");
  })

  it('should create station successfully and return the correct message and station properties', async () => {
    const stationData = {
      Nimi: "Fedex",
      Name: "Fedex",
      Namn: "Fedex",
      Osoite: "Fedex, Tullimiehentie 2, Vantaa, 01530",
      Adress: "Fedex, Tullimiehentie 2, Vantaa, 01530",
      Kaupunki: "Uusimaa",
      Stad: "Uusimaa",
      Kapasiteet: Math.floor(Math.random() * 37) + 8,
      Operaattor: "CityBike Finland",
      x: 24.99405,
      y: 60.309719

    }
    const resp = await supertest(server)
      .post('/api/add-station')
      .send({ data: stationData })

    expect(resp.status).toBe(201);
    expect(resp.body.message).to.equal("Station created successfully");

  })

})

describe('GET /get-station', async () => {

  it('should return a successful response with location data', async () => {

    const position = { lng: 24.93896484375, lat: 60.18796390589544 }

    const resp = await supertest(server)
      .post('/api/address-lookup')
      .send({ data: position })

    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty('data');

    const data = resp.body.data;

    expect(data).toHaveProperty('Name');
    expect(data).toHaveProperty('postalcode');
    expect(data).toHaveProperty('label');
    expect(data).toHaveProperty('region');
    expect(data).toHaveProperty('coordinates');

    expect(data.coordinates).toBeInstanceOf(Array);

  })

  it('should return 404 when "No result found"', async () => {
    const position = { lng: 24, lat: 60 }

    const resp = await supertest(server)
      .post('/api/address-lookup')
      .send({ data: position })

    expect(resp.status).toBe(404);
    expect(resp.body).not.toHaveProperty('data');
    expect(resp.body.message).to.equal("No results found.");

  })
})