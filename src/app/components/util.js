/**
 * USED IN: Table.jsx
 * 
 * Function sorts the array of objects in asc or desc order based on a specified key.
 * @param {Object} a - The first object to compare.
 * @param {Object} b - The second object to compare.
 * @param {string} orderBy - The key to use for sorting.
 * @returns {number} - A number indicating the order of the objects (asc || des)
 */
export const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

/**
 * USED IN: Table.jsx
 * 
 * Returns a comparator function that sorts an array of objects based on the specified order and key.
 * @param {string} order - The sort order ('asc' or 'desc').
 * @param {string} orderBy - The key to use for sorting.
 * @returns {function} - A comparator function that sorts the array based on the specified order and key.
 */
export const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => descendingComparator(a, b, orderBy) * -1;
}


/**
 * USED IN: Table.jsx
 * 
 * Returns a sorted version of the array, sorted using the specified comparator function.
 * @param {Array} array - The array to sort.
 * @param {function} comparator - A function used to compare the elements in the array.
 * @returns {Array} - sorted version array by order.
 */
export const stableSort = (array, comparator) => {
  return array?.slice().sort(comparator)
}


/**
 * USED IN: Journey.jsx
 * Returns an object containing the largest and smallest values of the specified property in the array of objects.
 * @param {Array} arr - The array of objects to search.
 * @param {string} property - The name of the property to find the largest and smallest values of.
 * @returns {Object} - An object with two properties: largest (the largest value of the specified property) and smallest (the smallest value of the specified property).
 */
export const findLargestAndSmallest = (arr, property) => {
  let largest = arr[0][property];
  let smallest = arr[0][property];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i][property] > largest) {
      largest = arr[i][property];
    }

    if (arr[i][property] < smallest) {
      smallest = arr[i][property];
    }
  }

  return { largest, smallest };
}

/**
 * USED IN: Journey.jsx
 * 
 * Transforms an array of journey objects by converting the object properties: m -> km, sec->m
 * @param {Array} journeys - The array of journey objects to transform.
 * @returns {Array} - An array of transformed journey objects.
 */
export const transformResultsArray = (journeys) => {
  const results = [];

  for (const journey of journeys) {
    const result = {
      ...journey,
      'Duration (sec)': Math.ceil(journey['Duration (sec)'] / 60), // Convert seconds to minutes
      'Covered distance (m)': Number((journey['Covered distance (m)'] / 1000).toFixed(2)), // Convert meters to kilometers
    };
    results.push(result);
  }
  return results;
}

/**
 * Pads a number with leading zeros up to a specified number of digits.
 * @param {number} num - The number to pad.
 * @param {number} digit - The total number of digits that the resulting string should have.
 * @returns {string} A string representation of the padded number.
 */
export const padNum = (num, digit) => {
  let str = num?.toString().padStart(digit, '0');
  return (str)
}


/**
 * Converts a duration in seconds to a string in the format "days, hours, minutes".
 * @param {number} seconds - The duration in seconds.
 * @returns {string} A string representing the duration in the specified format.
 */
export const convertMinutesToHours = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = '';
  if (days > 0) {
    result += `${days} day${days === 1 ? '' : 's'} `;
  }
  if (hours > 0) {
    result += `${hours} hour${hours === 1 ? '' : 's'} `;
  }
  if (minutes > 0) {
    result += `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  if (result === '') {
    result = `${seconds} second${seconds === 1 ? '' : 's'}`;
  }

  return result;
}
