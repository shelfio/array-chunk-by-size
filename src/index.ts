import stringify from 'json-stringify-safe';

type SizeCalcFunction<T> = (obj: T) => number;

/**
 * Chunk array of objects by their size when stringifies into JSON
 * @param {Object[]} input Array of objects to chunk
 * @param {Number} bytesSize Amount of bytes each chunk can have at max
 * @param {Boolean} failOnOversize Throw error if item is too big
 * @param {Function} sizeCalcFunction Custom function to calculate size of each item
 * @return {Object[][]} Array of arrays - chunked array by size
 */
export function chunkArray<T>({
  input,
  bytesSize = Number.MAX_SAFE_INTEGER,
  failOnOversize = false,
  sizeCalcFunction = getObjectSize<T>,
}: {
  input: T[];
  bytesSize?: number;
  failOnOversize?: boolean;
  sizeCalcFunction?: SizeCalcFunction<T>;
}): T[][] {
  const output: T[][] = [];
  let outputSize = 0;
  let outputFreeIndex = 0;

  if (!input || input.length === 0 || bytesSize <= 0) {
    return output;
  }

  for (const obj of input) {
    const objSize = sizeCalcFunction(obj);

    if (objSize > bytesSize && failOnOversize) {
      throw new Error(`Can't chunk array as item is bigger than the max chunk size`);
    }

    const fitsIntoLastChunk = outputSize + objSize <= bytesSize;

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
}

function getObjectSize<T>(obj: T): number {
  try {
    const str = stringify(obj);

    return Buffer.byteLength(str, 'utf8');
  } catch (error) {
    return 0;
  }
}
