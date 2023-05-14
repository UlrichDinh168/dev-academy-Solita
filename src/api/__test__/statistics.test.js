import { describe, expect, it, } from 'vitest';
import supertest from 'supertest'
import server from '../../server.js'


describe('POST /statistics/basic', () => {

  it('should return "Journey created successfully" when journey created successfully', async () => {
    const mockDate = '2021-05'

    const resp = await supertest(server)
      .post('/api/statistics/basic')
      .send({ data: mockDate })

    const data = resp.body.data

    expect(resp.status).toBe(200);

    expect(data[0]).toHaveProperty('_id');
    expect(data[0]).toHaveProperty('totalDuration');
    expect(data[0]).toHaveProperty('totalDistance');
    expect(data[0]).toHaveProperty('averageDuration');
    expect(data[0]).toHaveProperty('averageDistance');
    expect(data[0]).toHaveProperty('count');

  })
})

describe('POST /statistics/route', () => {

  it('should return Route Statistic in correct format', async () => {
    const mockDate = '2021-05'

    const resp = await supertest(server)
      .post('/api/statistics/route')
      .send({ data: mockDate })

    const data = resp.body.data

    expect(resp.status).toBe(200);

    expect(data[0]).toHaveProperty('count');
    expect(data[0]).toHaveProperty('_id');

    expect(data[0]._id).toHaveProperty('date');
    expect(data[0]._id).toHaveProperty('route');
    expect(data[0]._id.route).toHaveProperty('departure');
    expect(data[0]._id.route).toHaveProperty('return');

  })
})


describe('POST /statistics/station', () => {

  it('should return Route Statistic in a correct format', async () => {
    const mockDate = '2021-05'

    const resp = await supertest(server)
      .post('/api/statistics/station')
      .send({ data: mockDate })

    const data = resp.body.data[0].busiestStations[0]

    expect(resp.status).toBe(200);

    expect(data).toHaveProperty('station');
    expect(data).toHaveProperty('count');

  })
})