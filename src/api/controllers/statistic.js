const statisticCalculation_1 = (model) => {
  return async (req, res) => {
    try {
      const resp = await model.aggregate([
        {
          $match: {
            Departure: {
              $regex: "^2023-05"
            }
          }
        },
        // https://www.mongodb.com/docs/manual/core/aggregation-pipeline/
        {
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

const statisticCalculation_2 = (model) => {
  return async (req, res) => {
    try {
      const resp = await model.aggregate([
        {
          $match: {
            Departure: {
              $gte: new Date("2023-05-01T00:00:00Z"),
              $lt: new Date("2023-06-01T00:00:00Z")
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
                arrival: "$Return station name"
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            month: "$_id.date",
            route: { $concat: ["$_id.route.departure", " - ", "$_id.route.arrival"] },
            count: 1
          }
        },
        {
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
          $unwind: "$popularRoutes"
        },
        {
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
      res.status(500).json({ message: e.message });

    }
  }

}

const statisticCalculation_3 = (params) => {

}

module.exports = { statisticCalculation_1, statisticCalculation_2 };