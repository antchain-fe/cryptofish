/**
 * Account address: 32-bit string
 */
export type Address = string;

/**
 * Attribute of collection: 6-bit hex string
 * @example 12AB34
 * @example 98EF65
 */
export type Attribute = string;

/**
 * Collection item of cryptofish
 *
 * @param index {string(u32)} start from zero(0)
 * @param creator {Address} creator of current collection
 * @param attribute {Attribute} attributes, 6-bit hex
 * @param score {string(u32)} calculate by attribute, higher is better
 * @param favorCount {string(u64)} favor count
 */
export type Collection = Map<string, string>;
