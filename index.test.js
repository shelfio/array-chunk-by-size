const {chunkArray} = require('.');

function getObjWithSize(bytes) {
  return {abcd: 'a'.repeat(bytes - 11)}
}

it('should export chunkArray function', () => {
  expect(chunkArray).toBeInstanceOf(Function);
});

it('should return empty array if empty passed', () => {
  const input = [];
  const output = chunkArray({input});
  expect(output).toEqual([]);
});

it('should return empty array if size is invalid', () => {
  const input = [{a: 1}];
  const output = chunkArray({input, bytesSize: -100});
  expect(output).toEqual([]);
});

it('should split 3 equal items into 2 chunks 2+1', () => {
  const input = [
    getObjWithSize(100), getObjWithSize(100),
    getObjWithSize(100)
  ];
  const output = chunkArray({input, bytesSize: 200});

  expect(output).toEqual([
    [getObjWithSize(100), getObjWithSize(100)],
    [getObjWithSize(100)]
  ]);
});

it('should handle strings as well', () => {
  const input = [
    getObjWithSize(100), '{{{',
    getObjWithSize(100)
  ];
  const output = chunkArray({input, bytesSize: 200});

  expect(output).toEqual([
    [getObjWithSize(100), '{{{'],
    [getObjWithSize(100)]
  ]);
});

it('should split 4 items into 2 chunks 1+1+1+1', () => {
  const input = [
    getObjWithSize(53),
    getObjWithSize(89),
    getObjWithSize(84),
    getObjWithSize(33)
  ];
  const output = chunkArray({input, bytesSize: 20});

  expect(output).toEqual([
    [getObjWithSize(53)],
    [getObjWithSize(89)],
    [getObjWithSize(84)],
    [getObjWithSize(33)]
  ]);
});

it('should split 12 very big items', () => {
  const input = [
    getObjWithSize(120 * 1024), getObjWithSize(2 * 1024),
    getObjWithSize(200 * 1024),
    getObjWithSize(33), getObjWithSize(44 * 1024), getObjWithSize(55 * 1024)
  ];
  const output = chunkArray({input, bytesSize: 200 * 1024});

  expect(output).toEqual([
    [getObjWithSize(120 * 1024), getObjWithSize(2 * 1024)],
    [getObjWithSize(200 * 1024)],
    [getObjWithSize(33), getObjWithSize(44 * 1024), getObjWithSize(55 * 1024)]
  ]);
});

it('should split complex structure w/ empty array', () => {
  const input = [
    getObjWithSize(128), getObjWithSize(128), getObjWithSize(128), getObjWithSize(128),
    getObjWithSize(128 * 10),
    getObjWithSize(128), getObjWithSize(128), getObjWithSize(128), getObjWithSize(128),
    getObjWithSize(128 * 10),
    getObjWithSize(12), getObjWithSize(12), getObjWithSize(12), getObjWithSize(12),
    getObjWithSize(1024),
    {}, {}
  ];
  const output = chunkArray({input, bytesSize: 1024});

  expect(output).toEqual([
    [getObjWithSize(128), getObjWithSize(128), getObjWithSize(128), getObjWithSize(128)],
    [getObjWithSize(128 * 10)],
    [getObjWithSize(128), getObjWithSize(128), getObjWithSize(128), getObjWithSize(128)],
    [getObjWithSize(128 * 10)],
    [getObjWithSize(12), getObjWithSize(12), getObjWithSize(12), getObjWithSize(12)],
    [getObjWithSize(1024)],
    [{}, {}]
  ]);
});
