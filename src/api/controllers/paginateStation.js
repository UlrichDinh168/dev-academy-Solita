const paginatedFetchingStation = (model) => {
  return async (req, res) => {
    try {
      const data = await model.find({});

      return res.status(201).json({
        message: "Data fetched succesfully",
        data: data,
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};

module.exports = paginatedFetchingStation;