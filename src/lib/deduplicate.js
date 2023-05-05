const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { color } = require('console-log-colors');
const { fileURLToPath } = require('url');


/**
 * Reads one or more CSV files and removes duplicate lines from them. 
 * The resulting CSV files are saved with the same name
 * but with the suffix "-deduplicated" added before the file extension.
 *
 * @param {Array<string>} filePaths - An array of file paths to the CSV files to deduplicate.
 * @returns {Promise<Array<string>>} - A Promise that resolves to an array of file paths of the resulting deduplicated CSV files.
 */

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, './csv/');
const files = fs.readdirSync(directoryPath).filter(file => file.includes('2021') && !file.includes('deduplicated'));

const deduplicateCSVFiles = async (filePaths) => {

  const outputFileNames = [];

  for (const filePath of filePaths) {
    const lineSet = new Set();  // Create a new Set to store unique lines

    const absolutePath = path.join(directoryPath, filePath)

    const inputFile = fs.createReadStream(absolutePath);
    // creates a readline interface to read the contents of a file line by line.
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
        const updatedHeader = line.replace('Duration (sec.)', 'Duration (sec)'); // Remove (.) in header Duration (sec)
        outputFile.write(`${updatedHeader}\n`);
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
