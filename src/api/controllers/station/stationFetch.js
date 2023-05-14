const stationFetch = (model) => {
  return async (req, res) => {
    try {
      const data = await model.find({});

      return res.status(200).json({
        message: 'Stations fetched successfully.',
        data: data,
      });
    } catch (e) {
      res.status(500).json({ message: 'Stations fetch fail.' });
    }
  };
};

export default stationFetch;
