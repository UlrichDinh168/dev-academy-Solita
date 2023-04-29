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

