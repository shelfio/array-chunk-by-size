import {Bench} from 'tinybench';
import {chunkArray} from './lib/index.js';

function createAsciiObjects(count, payloadSize) {
  return Array.from({length: count}, (_, index) => ({
    id: index,
    label: `item-${index}`,
    payload: 'x'.repeat(payloadSize),
    active: index % 2 === 0,
  }));
}

function createUnicodeObjects(count, repeatCount) {
  return Array.from({length: count}, (_, index) => ({
    id: index,
    label: `unicode-${index}`,
    payload: '💩'.repeat(repeatCount),
    tags: [`group-${index % 4}`, `bucket-${index % 8}`],
  }));
}

function createAsciiStrings(count, payloadSize) {
  return Array.from({length: count}, (_, index) => `value-${index}-${'x'.repeat(payloadSize)}`);
}

function createPreSizedRecords(count, payloadSize) {
  return Array.from({length: count}, (_, index) => {
    const value = `value-${index}-${'x'.repeat(payloadSize)}`;

    return {
      id: index,
      size: Buffer.byteLength(value, 'utf8'),
      value,
    };
  });
}

async function runBench(bench) {
  await bench.run();
  console.log(`\n${bench.name}`);
  console.table(bench.table());
}

const smallAsciiObjects = createAsciiObjects(2_000, 48);
const mediumAsciiObjects = createAsciiObjects(2_000, 192);
const unicodeObjects = createUnicodeObjects(2_000, 24);
const asciiStrings = createAsciiStrings(10_000, 64);
const preSizedRecords = createPreSizedRecords(10_000, 64);

const objectBench = new Bench({
  name: 'chunkArray: default JSON size calculation',
  time: 300,
});

objectBench
  .add('2k small objects into ~4 KB chunks', () =>
    chunkArray({input: smallAsciiObjects, bytesSize: 4 * 1024})
  )
  .add('2k medium objects into ~16 KB chunks', () =>
    chunkArray({input: mediumAsciiObjects, bytesSize: 16 * 1024})
  )
  .add('2k unicode objects into ~8 KB chunks', () =>
    chunkArray({input: unicodeObjects, bytesSize: 8 * 1024})
  );

const customSizeBench = new Bench({
  name: 'chunkArray: custom size calculators',
  time: 300,
});

customSizeBench
  .add('10k strings with Buffer.byteLength', () =>
    chunkArray({
      input: asciiStrings,
      bytesSize: 2 * 1024,
      sizeCalcFunction: value => Buffer.byteLength(value, 'utf8'),
    })
  )
  .add('10k pre-sized records with cached size', () =>
    chunkArray({
      input: preSizedRecords,
      bytesSize: 2 * 1024,
      sizeCalcFunction: item => item.size,
    })
  );

await runBench(objectBench);
await runBench(customSizeBench);
