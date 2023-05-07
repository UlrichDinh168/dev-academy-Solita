const { countOccurrences, findTopFiveStations, fetchStation } = require('../utils/utils.js');
const station = require('../../lib/models/station.model.js');

const fetchStationDetails = (model) => {

  return async (req, res) => {
    const stationId = req.body.data;
    let stationsAtStart, stationsAtEnd

    try {
      // Count the journeys starting and ending with a station
      stationsAtStart = await model.find({ 'Departure station id': `${stationId}` });
      stationsAtEnd = await model.find({ 'Return station id': `${stationId}` });
    } catch (error) {
      console.log(error, 'error');
    }


    const numStationsAtStart = stationsAtStart.length;
    const numStationsAtDest = stationsAtEnd.length;


    // Calculate total distance
    const totalDistanceAtStart = stationsAtStart.reduce((acc, currentTrip) => {
      return acc + currentTrip['Covered distance (m)']
    }, 0)
    const totalDistanceAtDest = stationsAtStart.reduce((acc, currentTrip) => {
      return acc + currentTrip['Covered distance (m)']
    }, 0)


    // Calculate average distance
    const averageDistanceAtStart = totalDistanceAtStart / numStationsAtStart
    const averageDistanceAtDest = totalDistanceAtDest / numStationsAtDest


    // By counting times each station appear => top 5 in total start and return stations
    const occurrencesAtStart = countOccurrences(stationsAtStart, 'Return station id');
    const occurrencesAtEnd = countOccurrences(stationsAtEnd, 'Departure station id');


    // Sorting for top 5 
    const top5AtStart = findTopFiveStations(occurrencesAtStart)
    const top5AtEnd = findTopFiveStations(occurrencesAtEnd)

    // Fetch data from stations in top5 accordingly.
    const fetchAllData = async (myArray) => {
      let array = []

      for (const iterator of myArray) {
        let newItem = {}
        const data = await fetchStation('ID', iterator[0], station);
        newItem = {
          name: data[0]?.Name,
          occurrences: iterator[1],
          capacity: data[0].Kapasiteet,
          address: data[0]?.Osoite,
          x: data[0]?.x,
          y: data[0]?.y,
        }
        array.push(newItem)
      }
      return array
    };

    const returnTop5Start = await fetchAllData(top5AtStart)
    const returnTop5End = await fetchAllData(top5AtEnd)

    const returnDataset = {
      stationId,
      numStationsAtStart,
      numStationsAtDest,
      averageDistanceAtStart,
      averageDistanceAtDest,
      returnTop5Start,
      returnTop5End
    }

    try {
      return res.status(200).json({
        message: "Data fetched succesfully",
        data: returnDataset
        ,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = fetchStationDetails;