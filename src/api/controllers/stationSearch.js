const station = require('../../lib/models/station.model');
const { fetchStation } = require('../utils/utils.js');

const stationSearch = async (req, res) => {
  try {
    let value = req?.body.data

    if (value?.length > 2) {
      const searchResults = await fetchStation('Name', value, station)
      return res.status(200).json({
        message: "Station name fetched succesfully",
        data: searchResults,
      });
    }
  } catch (error) {

    console.log("error", error);
    return res.status(400).json({ message: "Failed to fetch journey name" });
  }

}

module.exports = stationSearch;