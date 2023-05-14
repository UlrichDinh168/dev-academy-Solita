import axios from 'axios';
import { createQuery } from '../utils/utils.js';
import dotenv from 'dotenv';
dotenv.config();

const calculateRoute = async (req, res) => {
  try {
    const { departure, destination } = req.body.data;
    const query = createQuery(departure, destination);

    const instance = await axios({
      method: 'post',
      url: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
      headers: {
        'Content-Type': 'application/graphql',
        'digitransit-subscription-key': process.env.DIGITRANSIT_KEY,
      },
      data: query,
    });

    return res.status(200).json({
      message: 'Journey fetched successfully.',
      data: instance?.data?.data?.plan?.itineraries,
    });
  } catch (error) {
    console.log(error, 'error');

    return res.status(400).json({ message: 'Could not fetch journey.' });
  }
};

export default calculateRoute;
