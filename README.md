# array-chunk-by-size [![CircleCI](https://img.shields.io/circleci/project/shelfio/array-chunk-by-size.svg)](https://circleci.com/gh/shelfio/array-chunk-by-size)

> Chunk array of objects by their size in JSON

## Install

```
$ yarn add @shelf/array-chunk-by-size
```

## Usage

Useful if you want to split large array into smaller, but limited by JSON size.

Each array chunk will be up to specified amount of bytes when stringified into JSON.

```js
import {chunkArray} from '@shelf/array-chunk-by-size';

const bigArray = [{a: 1}, {b: 2}, {c: 3}];
const twoKilobytes = 2 * 1024;

const smallerArrays = chunkArray({input: bigArray, bytesSize: twoKilobytes});
// => [ [ ... ], [ ... ] ] and so on
```

## See Also
- [fast-normalize-spaces](https://github.com/shelfio/fast-normalize-spaces)
- [fast-natural-order-by](https://github.com/shelfio/fast-natural-order-by)
- [fast-uslug](https://github.com/shelfio/fast-uslug)

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT © [Shelf](https://shelf.io)
