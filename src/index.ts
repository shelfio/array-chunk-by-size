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
  if (!input || input.length === 0 || bytesSize <= 0) {
    return [];
  }

  const output: T[][] = [];
  let currentChunk: T[] = [];
  let currentChunkSize = 0;

  for (const obj of input) {
    const objSize = sizeCalcFunction(obj);

    if (objSize > bytesSize && failOnOversize) {
      throw new Error(`Can't chunk array as item is bigger than the max chunk size`);
    }

    if (currentChunkSize + objSize > bytesSize && currentChunk.length > 0) {
      output.push(currentChunk);
      currentChunk = [];
      currentChunkSize = 0;
    }

    currentChunk.push(obj);
    currentChunkSize += objSize;
  }

  if (currentChunk.length > 0) {
    output.push(currentChunk);
  }

  return output;
}

function safeStringify(obj: unknown): string {
  const seen = new WeakSet();

  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }

    return value;
  });
}

function getObjectSize<T>(obj: T): number {
  try {
    const str = safeStringify(obj);

    return Buffer.byteLength(str, 'utf8');
  } catch {
    return 0;
  }
}
