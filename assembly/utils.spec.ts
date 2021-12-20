import { parseHex2Int } from './utils';

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
});
