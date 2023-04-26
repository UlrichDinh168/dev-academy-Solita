export default function findLargestAndSmallest(arr, property) {
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