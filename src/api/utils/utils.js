/**
 * Count the occurrences of objects in the array by using key as identifier.
 * @param {array} arr
 * @param {string} type
 * @returns
 */
const countOccurrences = (arr, type) => {
  return arr.reduce((acc, curr) => {
    const key = curr[type]; // create key for identifying objects
    acc[key] = (acc[key] || 0) + 1; // accumulate if found key, else set to 0
    return acc;
  }, {});
};

// Convert the counts object to an array of [key, value] pairs
const findTopFiveStations = (arrays) => {
  // Sort the counts array in descending order by value and take the top 5
  return Object.entries(arrays)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
};

const fetchStation = async (name, value, model) => {
  let searchResults;
  if (name === 'Name') {
    const upperCase = value?.replace(/^\w/, (c) => c.toUpperCase());
    const regexp = new RegExp(`^${upperCase}`);
    searchResults = await model.find({ [name]: regexp }).maxTimeMS(5000);
    return searchResults;
  }

  searchResults = await model.find({ [name]: value }).maxTimeMS(5000);

  return searchResults;
};

const findMaxValue = async (model, criteria) => {
  try {
    const resp = await model
      .findOne()
      .sort({ [criteria]: -1 })
      .maxTimeMS(10000)
      .exec();
    const max = Number(resp['ID']);
    return max;
  } catch (error) {
    console.log(error, 'err in api utils');
  }
};

/**
 * Generate GraphQL query string
 * @param {array} departure
 * @param {array} destination
 */
const createQuery = (departure, destination) =>
  `
  {
    plan(
      from: {lat: ${departure[0]}, lon: ${departure[1]}}
      to: {lat: ${destination[0]}, lon: ${destination[1]}}
      numItineraries: 3
      transportModes: [{mode: BICYCLE}]
    ) {
      itineraries {
        legs {
          duration
          distance
        }
      }
    }
  }
  `;

export { findMaxValue, findTopFiveStations, countOccurrences, fetchStation, createQuery };
