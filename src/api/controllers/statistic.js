const basicStatistic = (model) => {
  return async (req, res) => {
    const { data } = req?.body
    try {
      const resp = await model.aggregate([
        {
          $match: {
            Departure: {
              $regex: `^${data}`
            }
          }
        },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/
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
        message: "Data fetched succesfully",
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
          // Groups the matching documents by two fields: date and route. 
          // Date: is taken from the <Departure> using the $dateToString operator, which formats the date as a string in the format "%Y-%m". 
          // Route: is a combination of Departure - Return journey 
          // Start counting when a combination appears.
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
          //https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/
          $project: {
            _id: 0,
            month: "$_id.date",
            route: { $concat: ["$_id.route.departure", " - ", "$_id.route.return"] },
            count: 1
          }
        },
        {
          // $$ROOT: system variable in MongoDB that refers to the root document of the current stage of the aggregation pipeline.
          // $addToSet operator ensures that only unique documents are added to the array, so that there are no duplicates.
          $group: {
            _id: "$month",
            popularRoutes: { $addToSet: "$$ROOT" }
          }
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            popularRoutes: { $slice: ["$popularRoutes", 10] }
          }
        },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/
          // $unwind: deconstruct the popularRoutes array that was created in the previous $group stage,
          // Prep for the next stage, $replaceRoot: requires the documents to be in a specific format to replace the root document of the aggregation pipeline, 
          // forming each document in the array to become a separate document in the pipeline.
          $unwind: "$popularRoutes"
        },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/aggregation/replaceRoot/
          // $replaceRoot operator replaces a document with the specified document.
          // After the $unwind stage, the popularRoutes field is an object with month, route, and count properties. 
          // The $replaceRoot operator is used to replace each document with the popularRoutes object so that the output of the pipeline consists of documents with only the month, route, and count properties.
          $replaceRoot: { newRoot: "$popularRoutes" }
        },
        {
          $sort: { count: -1 }
        },
        {
          $group: {
            _id: "$month",
            popularRoutes: { $push: "$$ROOT" }
          }
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            popularRoutes: 1
          }
        },
        {
          $sort: { month: 1 }
        }
      ]).allowDiskUse(true);

      return res.status(200).json({
        message: "Data fetched succesfully",
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
              month: { $dateToString: { format: "%Y-%m", date: { $toDate: "$Departure" } } },
              station: "$Departure station name"
            },
            count: { $sum: 1 }
          }
        },
        // Sorts the documents in descending order by count.
        {
          $sort: {
            "_id.month": 1,
            count: -1
          }
        },
        // Groups the documents by the month, and creates a new field busiestStations that contains 
        // an array of the 10 busiest stations for each month. 
        // Each array element is an object with station and count properties.
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
          //https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/
          $project: {
            _id: 0,
            month: "$_id",
            busiestStations: { $slice: ["$busiestStations", 10] }
          }
        }
      ]).allowDiskUse(true);

      return res.status(200).json({
        message: "Data fetched succesfully",
        data: resp
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = { basicStatistic, routeStatistic, stationStatistic };