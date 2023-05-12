import { describe, test, expect } from 'vitest'
import { countOccurrences, findTopFiveStations } from '../utils/utils.js'

describe('countOccurrences', () => {
  const array = [
    { name: 'Alice', age: 23 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 23 },
    { name: 'Alice', age: 27 },
    { name: 'Bob', age: 23 },
  ];

  test('should count occurrences of objects by name property', () => {
    const result = countOccurrences(array, 'name');
    expect(result).toEqual({ 'Alice': 2, 'Bob': 2, 'Charlie': 1 });
  });

  test('should count occurrences of objects by age property', () => {
    const result = countOccurrences(array, 'age');
    expect(result).toEqual({ 23: 3, 25: 1, 27: 1 });
  });

  test('should return an empty object when given an empty array', () => {
    const result = countOccurrences([], 'name');
    expect(result).toEqual({});
  });

});


describe('findTopFiveStations', () => {
  test('findTopFiveStations returns top 5 stations in descending order', () => {
    const arrays = {
      'Station A': 10,
      'Station B': 8,
      'Station C': 15,
      'Station D': 5,
      'Station E': 20,
      'Station F': 3
    };

    const result = findTopFiveStations(arrays);

    expect(result).toEqual([
      ['Station E', 20],
      ['Station C', 15],
      ['Station A', 10],
      ['Station B', 8],
      ['Station D', 5]
    ]);
  });

  test('findTopFiveStations returns fewer than 5 stations if less than 5 stations provided', () => {
    const arrays = {
      'Station A': 10,
      'Station B': 8,
      'Station C': 15
    };

    const result = findTopFiveStations(arrays);

    expect(result).toEqual([
      ['Station C', 15],
      ['Station A', 10],
      ['Station B', 8]
    ]);
  });

  test('findTopFiveStations returns empty array if empty array is provided', () => {
    const arrays = {};

    const result = findTopFiveStations(arrays);

    expect(result).toEqual([]);
  });

})
