# array-chunk-by-size

> Chunk array of objects by their size in JSON

## Install

```
$ yarn add array-chunk-by-size
```

## Usage

Useful if you want to split large array into smaller, but limited by JSON size.

Each array chunk will be up to specified amount of bytes when stringified into JSON.

```js
import {chunkArray} from 'array-chunk-by-size';

const bigArray = [{a: 1}, {b: 2}, {c: 3}];
const twoKilobytes = 2 * 1024;

const smallerArrays = chunkArray({input: bigArray, bytesSize: twoKilobytes});
// => [ [ ... ], [ ... ] ] and so on
```

## License

MIT © [Vlad Holubiev](https://vladholubiev.com)
