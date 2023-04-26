const paginatedFetching = (model) => {
  return async (req, res) => {
    const { data } = req?.body
    const limit = 50
    let fields = {};
    const results = {};

    let depName = data['Departure station name'];
    let retName = data['Return station name']

    depName ? fields['Departure station name'] = depName : null;
    retName ? fields['Return station name'] = retName : null;

    fields = {
      'Departure station name': depName,
      'Return station name': retName
    }
    try {
      const docs = await model.find(fields).countDocuments().exec();
      results.last = Math.ceil((docs / limit));
    } catch (err) {
      console.log(err);
    }
    const page = 1

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit
      };
    }
    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit
      };
    }

    try {
      results.results = await model.find(fields).limit(limit).skip(startIndex).exec();
      return res.status(201).json({
        message: "Data fetched succesfully",
        data: {
          paginatedResults: results
        },
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }

  };
};
export default paginatedFetching