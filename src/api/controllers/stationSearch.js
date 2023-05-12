// const station = require('../../lib/models/station.model');
// const { fetchStation } = require('../utils/utils.js');

import { fetchStation } from '../utils/utils.js';
import station from '../../lib/models/station.model.js';


const stationSearch = async (req, res) => {
  try {
    let value = req?.body.data

    if (value?.length > 2) {
      const searchResults = await fetchStation('Name', value, station)
      return res.status(200).json({
        message: "Station name fetched successfully",
        data: searchResults,
      });
    }
  } catch (error) {

    console.log("error", error);
    return res.status(400).json({ message: "Failed to fetch journey name" });
  }

}

export default stationSearch
// module.exports = stationSearch;