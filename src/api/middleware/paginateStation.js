const paginatedFetchingStation = (model) => {
  return async (req, res) => {
    const { data } = req?.body
    const limit = 50
    let lastPage, previousPage, nextPage, stations
    const query = {};

    try {
      const docs = await model.find(query).countDocuments().exec();
      lastPage = Math.ceil((docs / limit));
    } catch (err) {
      console.log(err);
    }

    const page = 1
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (startIndex > 0) {
      previousPage = {
        page: page - 1,
        limit
      };
    }
    if (endIndex < await model.countDocuments().exec()) {
      nextPage = {
        page: page + 1,
        limit
      };
    }

    try {
      stations = await model.find(query).limit(limit).skip(startIndex).exec();
      const returnDataset = {
        lastPage, previousPage, nextPage, stations
      }
      return res.status(201).json({
        message: "Data fetched succesfully",
        data: returnDataset,
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};
export default paginatedFetchingStation