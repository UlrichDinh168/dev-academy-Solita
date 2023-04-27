import { countOccurrences, findTopFiveStations } from "../utils/utils.js";

const fetchStationDetails = (model) => {

  return async (req, res) => {
    const stationId = req.body.data;
    let stationsAtStart, stationsAtEnd

    console.log(stationId, 'stationId');

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
    const totalDistanceAtStart = stationsAtStart.reduce((accumulator, currentTrip) => {
      return accumulator + currentTrip['Covered distance (m)']
    }, 0)
    const totalDistanceAtDest = stationsAtStart.reduce((accumulator, currentTrip) => {
      return accumulator + currentTrip['Covered distance (m)']
    }, 0)


    // Calculate average distance
    const averageDistanceAtStart = totalDistanceAtStart / numStationsAtStart
    const averageDistanceAtDest = totalDistanceAtDest / numStationsAtDest


    // By counting times each station appear => top 5 in total start and return stations
    const occurrencesAtStart = countOccurrences(stationsAtStart, 'Return station name');
    const occurrencesAtEnd = countOccurrences(stationsAtEnd, 'Departure station name');

    // Sorting for top 5 
    const top5AtStart = findTopFiveStations(occurrencesAtStart)
    const top5AtEnd = findTopFiveStations(occurrencesAtEnd)


    const returnDataset = {
      stationId,
      numStationsAtStart,
      numStationsAtDest,
      averageDistanceAtStart,
      averageDistanceAtDest,
      top5AtStart,
      top5AtEnd
    }

    try {
      return res.status(201).json({
        message: "Data fetched succesfully",
        data: returnDataset
        ,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });

    }


  }

}

export default fetchStationDetails