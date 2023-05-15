// Imports
import { describe, it, expect } from 'vitest';
import deduplicateCSVFiles from '../deduplicate.js';
import path from 'path'
import fs from 'fs';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const directoryPath = path.join(__dirname, '../csv');

const files = fs.readdirSync(directoryPath)
  .filter(file => file.includes('mock')
    && !file.includes('deduplicated')
    && !file.includes('actual')
    && file.includes('csv'));

const expectedOutputFileNames = ['mock-file-1-deduplicated.csv', 'mock-file-2-deduplicated.csv'];

describe('deduplicateCSVFiles', async () => {

  it('should return correct file names', async () => {
    const outputFileNames = await deduplicateCSVFiles(files);

    assert.deepStrictEqual(outputFileNames, expectedOutputFileNames);
  });


  it('Files have the same length', async () => {
    const outputFileNames = await deduplicateCSVFiles(files);

    const actuals = fs.readdirSync(directoryPath)
      .filter(file =>
        file.includes('mock')
        && !file.includes('station')
        && file.includes('actual'));



    const file1Actual = fs.statSync(`${directoryPath}/${actuals[0]}`);
    const file1Dupped = fs.statSync(`${directoryPath}/${outputFileNames[0]}`);

    const file2Actual = fs.statSync(`${directoryPath}/${actuals[0]}`);
    const file2Dupped = fs.statSync(`${directoryPath}/${outputFileNames[0]}`);

    expect(file1Actual.size).toBe(file1Dupped.size);
    expect(file2Actual.size).toBe(file2Dupped.size);
  });

});