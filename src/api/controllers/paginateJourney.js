const paginatedFetchingJourney = (model) => {
  return async (req, res) => {
    const { data } = req?.body
    const limit = 10
    let query = {};
    let lastPage, previousPage, nextPage

    let depName = data['Departure station name'];
    let retName = data['Return station name']

    depName ? query['Departure station name'] = depName : null;
    retName ? query['Return station name'] = retName : null;

    // set query for Mongoose search
    query = {
      'Departure station name': depName,
      'Return station name': retName
    }

    try {
      const docs = await model.find(query).countDocuments().exec();
      lastPage = Math.ceil((docs / limit)); // identify last page based on limit per batch
    } catch (error) {
      console.log(error);
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
      // skip startIndex to begin a new fetch fetch
      const journeys = await model.find(query).limit(limit).skip(startIndex).exec();
      const returnDataset = {
        lastPage, previousPage, nextPage, journeys
      }

      if (journeys.length === 0) {
        return res.status(404).json({ message: 'There was no journey for these stations', data: [] });
      }

      return res.status(200).json({
        message: "Data fetched successfully",
        data: returnDataset
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};

export default paginatedFetchingJourney
// module.exports = paginatedFetchingJourney;