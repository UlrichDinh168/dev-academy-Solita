const basicStatistic = (model) => {
  return async (req, res) => {
    const { data } = req?.body
    try {
      const resp = await model.aggregate([
        {
          //https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/
          // Filters documents where the <Departure> starts with the string.
          $match: {
            Departure: {
              $regex: `^${data}`
            }
          }
        },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/
          // Groups the matching documents by two fields: month and station. 
          // The month: is taken from the <Departure> using the $dateToString operator, which formats the date as a string in the format "%Y-%m". 
          // _id: is used to group the documents.
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m",
                date: { $toDate: "$Departure" }
              }
            },
            totalDuration: { $sum: "$Duration (sec)" },
            averageDuration: { $avg: "$Duration (sec)" },
            totalDistance: { $sum: "$Covered distance (m)" },
            averageDistance: { $avg: "$Covered distance (m)" },
            count: { $sum: 1 } // Add a count field to calculate the total number of rows
          }
        },
      ])

      return res.status(200).json({
        message: "Data fetched successfully",
        data: resp
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};


const routeStatistic = (model) => {
  return async (req, res) => {
    const { data } = req?.body

    try {
      /**
      * A MongoDB aggregation pipeline to retrieve information on the popular routes for a given month,
      * filtered by a specific prefix on the Departure field of the documents in the collection.
      * @param {MongoDB model} model 
      * @returns 
      */
      const resp = await model.aggregate([
        {
          $match: {
            Departure: {
              $regex: `^${data}`
            }
          }
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: {
                  format: "%Y-%m",
                  date: { $toDate: "$Departure" }
                }
              },
              route: {
                departure: "$Departure station name",
                return: "$Return station name"
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10 // Adjust the limit to a value that works for your memory constraints
        },
      ]).allowDiskUse(true);


      return res.status(200).json({
        message: "Data fetched successfully",
        data: resp
      });

    } catch (error) {
      res.status(500).json({ message: error.message });

    }
  }
}


const stationStatistic = (model) => {
  return async (req, res) => {
    const { data } = req?.body

    try {
      /**
      * Calculates route statistics using the provided model and returns the result as a JSON response.
      * @param {MongoDB model} model 
      */
      const resp = await model.aggregate([
        {
          $match: {
            Departure: {
              $regex: `^${data}`
            }
          }
        },
        {
          $group: {
            _id: {
              month: { $dateToString: { format: "%Y-%m", date: { $toDate: "$Departure" } } },
              station: "$Departure station name"
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            "_id.month": 1,
            count: -1
          }
        },
        {
          $group: {
            _id: "$_id.month",
            busiestStations: {
              $push: {
                station: "$_id.station",
                count: "$count"
              }
            },
          }
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            busiestStations: { $slice: ["$busiestStations", 10] }
          }
        }
      ]).allowDiskUse(true);

      return res.status(200).json({
        message: "Data fetched successfully",
        data: resp
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export { basicStatistic, routeStatistic, stationStatistic }