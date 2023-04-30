// find min, max value for each batch calls
export const findMaxMinValue = async (model, criteria) => {
  return Promise.all([
    model.findOne().sort({ [criteria]: -1 }).exec(),
    model.findOne().sort({ [criteria]: 1 }).exec()
  ]).then(values => {
    const max = values[0][criteria];
    const min = values[1][criteria];
    return { max, min };
  }).catch(error => {
    console.log(error, 'err in api utils');
    return { max: null, min: null };
  });
}

/**
 * Count the occurrences of objects in the array by using key as identifier.
 * @param {array} arr 
 * @param {string} type 
 * @returns 
 */
export const countOccurrences = (arr, type) => {
  return arr.reduce((acc, curr) => {
    const key = curr[type]; // create key for identifying objects
    acc[key] = (acc[key] || 0) + 1; // accumulate if found key, else set to 0
    return acc;
  }, {});
};

// Convert the counts object to an array of [key, value] pairs
export const findTopFiveStations = (arrays) => {
  // Sort the counts array in descending order by value and take the top 5
  return Object.entries(arrays).sort((a, b) => b[1] - a[1]).slice(0, 5);
}

export const fetchStation = async (name, value, model) => {
  if (name === 'Name') {
    console.log('here');
    const upperCase = value?.replace(/^\w/, (c) => c.toUpperCase());
    const regexp = new RegExp(`^${upperCase}`)
    const searchResults = await model.find({ [name]: regexp }).maxTimeMS(30000);
    return searchResults
  }

  const searchResults = await model.find({ [name]: value }).maxTimeMS(30000);
  return searchResults
}

export const findMaxValue = async (model, criteria) => {
  try {
    const resp = await model.findOne().sort({ [criteria]: -1 }).exec()
    const max = Number(resp['ID'])
    return max;

  } catch (error) {
    console.log(error, 'err in api utils');
    return { max: null, min: null };
  }

}
