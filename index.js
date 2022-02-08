const stringify = require('json-stringify-safe');

/**
 * Chunk array of objects by their size when stringified into JSON
 * @param {Object[]} input Array of objects to chunk
 * @param {Number} bytesSize Amount of bytes each chunk can have at max
 * @param {Boolean} failOnOversize Throw error if item is too big
 * @return {Object[][]} Array of arrays - chunked array by size
 */
module.exports.chunkArray = function({input, bytesSize = Number.MAX_SAFE_INTEGER, failOnOversize = false}) {
  const output = [];
  let outputSize = 0;
  let outputFreeIndex = 0;

  if (!input || input.length === 0 || bytesSize <= 0) {
    return output;
  }

  for (let obj of input) {
    const objSize = getObjectSize(obj);
    if (objSize > bytesSize && failOnOversize) {
      throw new Error(`Can't chunk array as item is bigger than the max chunk size`)
    }

    const fitsIntoLastChunk = (outputSize + objSize) <= bytesSize;

    if (fitsIntoLastChunk) {
      if (!Array.isArray(output[outputFreeIndex])) {
        output[outputFreeIndex] = [];
      }

      output[outputFreeIndex].push(obj);
      outputSize += objSize;
    } else {
      if (output[outputFreeIndex]) {
        outputFreeIndex++;
        outputSize = 0;
      }

      output[outputFreeIndex] = [];
      output[outputFreeIndex].push(obj);
      outputSize += objSize;
    }
  }

  return output;
};

function getObjectSize(obj) {
  try {
    const str = stringify(obj);
    return Buffer.byteLength(str, 'utf8');
  } catch (error) {
    return 0;
  }
}
