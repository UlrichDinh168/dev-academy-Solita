import { describe, expect, beforeAll, afterAll, it } from 'vitest';
import supertest from 'supertest'
import server from '../../server.js'
import { MongoClient } from 'mongodb';

const { DATABASE_URL, DB_NAME } = process.env;


describe('POST /get-journey', () => {

  it('should return journey structure correctly', async () => {
    const journeyData = {
      "Departure station name": "Pasilan asema",
      "Return station name": "Kamppi (M)",
      page: 1
    }

    const resp = await supertest(server)
      .post('/api/get-journey')
      .send({ data: journeyData })

    const data = resp.body.data

    expect(resp.status).toBe(200);

    expect(data).toHaveProperty('lastPage');
    expect(data).toHaveProperty('nextPage');
    expect(data).toHaveProperty('journeys');

    expect(data.journeys).toBeInstanceOf(Array);

    expect(data.lastPage).toBe(4);
    expect(data.nextPage.page).toBe(2);
    expect(data.nextPage.limit).toBe(10);

    const journeys = data.journeys[0];

    expect(journeys).toHaveProperty('_id');
    expect(journeys).toHaveProperty('Departure');
    expect(journeys).toHaveProperty('Return');
    expect(journeys).toHaveProperty('Departure station id');
    expect(journeys).toHaveProperty('Departure station name');
    expect(journeys).toHaveProperty('Return station id');
    expect(journeys).toHaveProperty('Return station name');
    expect(journeys).toHaveProperty('Covered distance (m)');
    expect(journeys).toHaveProperty('Duration (sec)');

  })


  it('should return message "There was no journey for these stations" when no  jounreys found', async () => {

    const journeyData = {
      "Departure station name": "Pasilan asema",
      "Return station name": "Kamppi",
      page: 1
    }

    const resp = await supertest(server)
      .post('/api/get-journey')
      .send({ data: journeyData })

    expect(resp.status).toBe(404);
    expect(resp.body.message).to.equal("There was no journey for these stations");
    expect(resp.body.data).toStrictEqual([]);
  })

  it('should return correct length of each batch', async () => {

    const journeyData = {
      "Departure station name": "Pasilan asema",
      "Return station name": "Kamppi (M)",
      page: 1
    }

    const resp = await supertest(server)
      .post('/api/get-journey')
      .send({ data: journeyData })

    expect(resp.status).toBe(200);
    expect(resp.body.data.journeys.length).toBe(10);
  })

})


describe('POST /add-journey', () => {

  let client;
  let db;
  beforeAll(async () => {
    // connect to the database
    client = await MongoClient.connect(DATABASE_URL);
    db = client.db(DB_NAME);
  });

  afterAll(async () => {
    // remove the data that was created during the tests
    await db.collection('journeys').deleteOne({
      "Departure": "2023-05-09T22:03:22.577Z",
      "Return": "2023-05-09T22:26:40.841Z",
      "Departure station id": "007",
      "Return station id": "903",
    });

    // close the database connection
    await client.close();
  });

  it('should return "Journey created successfully" when journey created successfully', async () => {
    const journeyData = {
      "Departure": "2023-05-09T22:03:22.577Z",
      "Return": "2023-05-09T22:26:40.841Z",
      "Departure station name": "Designmuseo",
      "Departure station id": "007",
      "Return station name": "Desiro",
      "Return station id": "903",
      "Covered distance (m)": 4354,
      "Duration (sec)": 1301
    }
    const resp = await supertest(server)
      .post('/api/add-journey')
      .send({ data: journeyData })

    expect(resp.status).toBe(201);
    expect(resp.body.message).to.equal("Journey created successfully");

  })
})

describe('POST /get-routes', () => {

  it('should return correct routes for journey', async () => {
    const journeyData = {
      departure: [60.170, 24.213],
      destination: [60.170, 24.254]
    }

    const resp = await supertest(server)
      .post('/api/get-routes')
      .send({ data: journeyData })


    expect(resp.status).toBe(200);
    expect(resp.body.message).to.equal("Journey fetched successfully");


    expect(resp.body).toHaveProperty('data');

  })

})