const { graphhopperAPI, fetchKeys } = require('../constant.js');

const apiKey = '5119eaf4-9206-46a6-9c06-2e7ffa98d33c';

const calculateRoute = async (req, res) => {
  try {
    const { departure, destination } = req?.body?.data;
    console.log(departure, destination, 'req');

    const graphhopper_api_key = await fetchKeys()
    console.log(graphhopper_api_key, 'graphhopper_api_key');

    const response = await graphhopperAPI.get(`/route?point=${departure[0]},${departure[1]}&point=${destination[0]},${destination[1]}&vehicle=bike&points_encoded=false&locale=en-US&instructions=true&elevation=true&key=${apiKey}`);

    const { time, distance, instructions } = response?.data?.paths[0]
    console.log(time, distance, 'sss');

    return res.status(200).json({
      message: "Station name fetched succesfully",
      data: { time, distance, instructions },
    });

  } catch (error) {
    console.log("err", error);
    return res.status(400).json({ message: "Could not fetch journey" });
  }

}

module.exports = calculateRoute 