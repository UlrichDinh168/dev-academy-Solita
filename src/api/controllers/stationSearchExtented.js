import { digitransitAPI } from '../constant.js';

const stationSearchExtented = async (req, res) => {
  try {
    let value = req?.body?.data;
    if (value?.length > 2) {
      const defaultData = await digitransitAPI.get(
        `/geocoding/v1/search?text=${value}&lang=en&sources=oa%2Cosm%2Cnlsfi&boundary.circle.lat=60.1699&boundary.circle.lon=24.9384&boundary.circle.radius=50`
      );

      const transportData = await digitransitAPI.get(
        `/geocoding/v1/search?text=${value}&lang=en&sources=gtfsHSL%2CgtfsHSLlautta&boundary.circle.lat=60.1699&boundary.circle.lon=24.9384&boundary.circle.radius=50`
      );

      const combinedData = [...transportData.data.features, ...defaultData.data.features];

      const newData = [];

      for (const key in combinedData) {
        if (Object.hasOwnProperty.call(combinedData, key)) {
          let newObj = {};
          const element = combinedData[key];
          const {
            geometry: { coordinates },
            properties: { name: label, label: Name, postalcode, region },
          } = element;
          newObj = { coordinates, label, Name, postalcode, region };
          newData.push(newObj);
        }
      }

      return res.status(200).json({
        message: 'Station name fetched successfully.',
        data: newData,
      });
    }
  } catch (error) {
    console.log('err', error);
    return res.status(400).json({ message: 'Failed to fetch journey name.' });
  }
};

export default stationSearchExtented;
