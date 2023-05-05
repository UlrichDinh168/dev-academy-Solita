function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => descendingComparator(a, b, orderBy) * -1;
}

export function stableSort(array, comparator) {
  return array?.slice().sort(comparator)
}

// Slider
export function findLargestAndSmallest(arr, property) {
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

// SearchArea component
export function transformResultsArray(results) {
  const transformedResults = [];

  for (const result of results) {
    const transformedResult = {
      ...result,
      'Duration (sec)': Math.ceil(result['Duration (sec)'] / 60), // Convert seconds to minutes
      'Covered distance (m)': Number((result['Covered distance (m)'] / 1000).toFixed(2)), // Convert meters to kilometers
    };
    transformedResults.push(transformedResult);
  }

  return transformedResults;
}


export const padNum = (num, digit) => {
  let str = num?.toString().padStart(digit, '0');
  return (str)
}

export const convertMinutesToHours = (seconds) => {
  // const hours = Math.floor(seconds / 3600);
  // const remainingMinutes = seconds % 60;

  // if (hours === 0) {
  //   return `${remainingMinutes} minutes`;
  // } else if (remainingMinutes === 0) {
  //   return `${hours} hours`;
  // } else {
  //   return `${hours} hours and ${remainingMinutes} minutes`;
  // }
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
