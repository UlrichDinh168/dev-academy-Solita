import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { color, log } from 'console-log-colors';
import { fileURLToPath } from 'url';

/**
 * Reads one or more CSV files and removes duplicate lines from them. 
 * The resulting CSV files are saved with the same name
 * but with the suffix "-deduplicated" added before the file extension.
 *
 * @param {Array<string>} filePaths - An array of file paths to the CSV files to deduplicate.
 * @returns {Promise<Array<string>>} - A Promise that resolves to an array of file paths of the resulting deduplicated CSV files.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, './csv/');
const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.csv') && file.includes('2021'));

console.log(files, 'files');

const deduplicateCSVFiles = async (filePaths) => {

  const lineSet = new Set();  // Create a new Set to store unique lines

  const outputFileNames = [];

  for (const filePath of filePaths) {
    const absolutePath = path.join(directoryPath, filePath)

    console.log(path.join(directoryPath, filePath), 'sss');

    const inputFile = fs.createReadStream(absolutePath);
    const rl = readline.createInterface({
      input: inputFile,
      crlfDelay: Infinity
    });

    // Generate the output file path by adding '-deduplicated' to the file name
    const outputFilePath = `${directoryPath}/${filePath.substring(0, filePath.length - 4)}-deduplicated.csv`;
    outputFileNames.push(`${filePath.substring(0, filePath.length - 4)}-deduplicated.csv`);

    const outputFile = fs.createWriteStream(outputFilePath);
    let isFirstLine = true;

    // Remove duplicate lines from the file
    for await (const line of rl) {
      if (isFirstLine) {
        const updatedHeder = line.replace('Duration (sec.)', 'Duration (sec)'); // Remove dot in header Duration (sec)
        outputFile.write(`${updatedHeder}\n`);
        isFirstLine = false;
        continue;
      }
      // If the line is not already in the set, add it to the set and write it to the output file
      if (!lineSet.has(line)) {
        lineSet.add(line);
        outputFile.write(`${line}\n`);
      }
    }
    outputFile.end();
  }

  return outputFileNames;
}




deduplicateCSVFiles(files)
  .then(outputFileNames => {
    console.log(`\nDeduplicated files:\n ${color.cyan(outputFileNames.join('\n '))}`);
  })
  .catch(error => {
    console.error(error);
  });
