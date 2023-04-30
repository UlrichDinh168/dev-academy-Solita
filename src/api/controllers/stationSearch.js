import station from '../../lib/models/station.model.js'
import { fetchStation } from '../utils/utils.js'

export default async function stationSearch(req, res) {
  try {
    let value = req?.body.data
    if (value?.length > 2) {
      const searchResults = await fetchStation('Name', value, station)
      return res.status(201).json({
        message: "Station name fetched succesfully",
        data: searchResults,
      });
    }
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({ message: "Failed to fetch journey name" });
  }

}