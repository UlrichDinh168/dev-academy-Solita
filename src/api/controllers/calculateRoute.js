const axios = require('axios');

const calculateRoute = async (req, res) => {

  try {

    const { departure, destination } = req?.body?.data;

    const query = createQuery(departure, destination)

    const instance = await axios({
      method: 'post',
      url: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
      headers: {
        'Content-Type': 'application/graphql',
        'digitransit-subscription-key': '486aab41f80e491e9068ec79e3a3f30d',
      },
      data: query
    });

    console.log(instance?.data, 'instance');

    return res.status(200).json({
      message: "Station name fetched succesfully",
      data: instance?.data?.data?.plan?.itineraries
    });

  } catch (error) {
    console.log(error?.data?.errors, 'error');

    return res.status(400).json({ message: "Could not fetch journey" });
  }

}

const createQuery = (departure, destination) =>
  `
  {
    plan(
      from: {lat: ${departure[0]}, lon: ${departure[1]}}
      to: {lat: ${destination[0]}, lon: ${destination[1]}}
      numItineraries: 3
      transportModes: [{mode: BICYCLE}]
    ) {
      itineraries {
        legs {
          duration
          distance
        }
      }
    }
  }
  `

module.exports = calculateRoute 