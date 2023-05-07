const stationFetching = (model) => {
  return async (req, res) => {
    try {
      const data = await model.find({});

      return res.status(200).json({
        message: "Data fetched succesfully",
        data: data,
      });

    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};

module.exports = stationFetching;