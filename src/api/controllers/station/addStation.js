import { findMaxValue } from '../../utils/utils.js';

const addStation = (model) => {
  return async (req, res) => {
    try {
      const { data } = req.body;

      // Check for existing user with the same username
      const existingJourney = await model.findOne({ Name: data?.Name });
      if (existingJourney) {
        return res.status(409).send('Station is already taken.');
      }

      const prevMaxID = await findMaxValue(model, 'ID');
      const prevMaxFID = await findMaxValue(model, 'FID');

      const query = {
        ...data,
        x: data?.latitude,
        y: data?.longitude,
        ID: prevMaxID + 1,
        FID: prevMaxFID + 1,
      };

      delete query.latitude;
      delete query.longitude;

      const newStation = new model(query);
      await newStation.save();

      return res.status(201).json({
        message: 'Station created successfully.',
      });
    } catch (err) {
      console.log(err, 'Error at Add station');
      return res.status(500).send('Station create fail.');
    }
  };
};
export default addStation;
