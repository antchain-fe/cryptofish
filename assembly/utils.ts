/**
 * Parse hex string to u32 int
 * @param hexWithCase {string}
 * @returns u32
 */
export function parseHex2Int(hexWithCase: string): u32 {
  // AssemblyScript currently, the switch conditions (case values) are implicitly
  // converted to u32, i.e. switching over strings or similar is not yet supported.
  const hex = hexWithCase.toUpperCase();
  if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(hex)) {
    return <u32>parseInt(hex, 10);
  } else if (hex == 'A') {
    return 10;
  } else if (hex == 'B') {
    return 11;
  } else if (hex == 'C') {
    return 12;
  } else if (hex == 'D') {
    return 13;
  } else if (hex == 'E') {
    return 14;
  } else if (hex == 'F') {
    return 15;
  }
  throw new Error('[cryptofish] invilid hex string');
}
