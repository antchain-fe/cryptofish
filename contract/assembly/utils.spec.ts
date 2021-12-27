import { Collection } from './types';
import { parseHex2Int, stringifyCollection, stringifyCollections } from './utils';

const createCollection = (index: i32): Collection => {
  const c: Collection = new Map<string, string>();
  c.set('index', index.toString());
  c.set('creator', '0x111111111111111');
  c.set('attribute', '012345');
  c.set('score', '100');
  c.set('favorCount', '0');
  return c;
};

describe('utils func works', () => {
  it('should work when parseHex2Int', () => {
    const str = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'A',
      'b',
      'B',
      'c',
      'C',
      'd',
      'D',
      'e',
      'E',
      'f',
      'F',
    ];
    const value: u32[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15];
    for (let index = 0; index < str.length; index += 1) {
      const currentStr = str[index];
      const currentValue = value[index];
      expect<u32>(parseHex2Int(currentStr)).toBe(currentValue);
    }
  });

  it('should work with stringifyCollection', () => {
    const collection = createCollection(0);
    const str = stringifyCollection(collection);
    expect(str).toBe('{"index":0,"creator":"0x111111111111111","attribute":"012345","score":100,"favorCount":0}');
  });

  it('should work with stringifyCollections', () => {
    const collection0 = createCollection(0);
    const collection1 = createCollection(1);
    const collections = [collection0, collection1];
    const str = stringifyCollections(collections);
    expect(str).toBe(
      '[{"index":0,"creator":"0x111111111111111","attribute":"012345","score":100,"favorCount":0},{"index":1,"creator":"0x111111111111111","attribute":"012345","score":100,"favorCount":0}]',
    );
  });
});
