import station from '../../lib/models/station.model.js'

export default async function journeySearch(req, res) {
  try {
    let value = req?.body.data
    console.log(value, 'val');
    if (value?.length > 2) {
      const upperCase = value?.replace(/^\w/, (c) => c.toUpperCase());
      const regexp = new RegExp(`^${upperCase}`)

      const searchResults = await station.find({ Name: regexp }).maxTimeMS(30000);
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