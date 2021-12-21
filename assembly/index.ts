import { my, BaseContract } from '@antchain/myassembly';
import { Address, Attribute, AttributeType, Collection } from './types';
import { parseHex2Int } from './utils';

export default class CryptoFishContract extends BaseContract {
  // TODO: You can use this hash to verify the image file containing all the fish
  public ruleHash: string = 'xxxxxxxx';
  // CryptoFish standard name
  public standard: string = 'CryptoFish';

  // Collection count limit per address
  private limit: u32;
  // CryptoFish contract owner's address
  private owner!: Address;
  // Collections list
  private collections!: Collection[];

  // Private builtin attributes infos
  private attributeKeyList!: AttributeType[];
  private attributeWeights!: Map<AttributeType, u32>;
  private attributes!: Map<AttributeType, string>;

  constructor() {
    super();
    this.init();
  }

  // TODO: change to private before deploy
  // Init contract, only called when contract is deploying by developer
  public init(): void {
    this.limit = 20; // TODO: verify this value
    this.owner = my.getSender().toString(); // Record the contract developer as owner
    this.collections = [];

    // attribute key list depends on rule hash
    this.attributeKeyList = ['skin', 'background', 'frame', 'fin', 'eye', 'tail'];

    // attributes depends on rule hash
    const attributes = new Map<AttributeType, string>();
    attributes.set('skin', '0123456789');
    attributes.set('background', '0123456789ABCDEF');
    attributes.set('frame', '0123456789ABCDEF');
    attributes.set('fin', '0123456789');
    attributes.set('eye', '0123456789');
    attributes.set('tail', '0123456789');
    this.attributes = attributes;

    // `skin/background/frame` has double weights than others when calculating score
    const attributeWeights = new Map<AttributeType, u32>();
    attributeWeights.set('skin', 200);
    attributeWeights.set('background', 200);
    attributeWeights.set('frame', 200);
    attributeWeights.set('fin', 100);
    attributeWeights.set('eye', 100);
    attributeWeights.set('tail', 100);
    this.attributeWeights = attributeWeights;

    this.log(`contract created by: ${this.owner}`);

    // Grant the first(index: 0) collection to our developer.
    this.mint();
  }

  // Mint collection for current address
  public mint(): bool {
    // current address
    const creator = my.getSender().toString();
    const ownedCount = <u32>this.getOwnedCollections().length;

    // Limit for each address(see `this.limit`)
    // Developers are not restricted
    if (creator != this.owner && ownedCount >= this.limit) {
      this.log(`error: you cannot own more than ${this.limit} collections(${creator})`);
      return false;
    }

    // generate unique and available attribute
    const attribute = this.generateUniqAttribute();
    const index = this.collections.length; // TODO: needs to lock `this.collections`?

    const collection: Collection = new Map<string, string>();
    collection.set('index', index.toString());
    collection.set('creator', creator);
    collection.set('attribute', attribute);
    collection.set('score', this.calculateScore(attribute).toString());
    collection.set('favorCount', '0');

    this.log(`mint collection success:`);
    this.printCollection(collection);
    this.collections.push(collection);
    return true;
  }

  // Favor collection by #Index
  // "favorByIndex(int)[0]" => "true/false"
  public favorByIndex(index: u32): bool {
    return this.favorCollection(this.getCollectionByIndex(index));
  }

  // Favor collection by attribute
  // "favorByAttribute(string)[123456]" => "true/false"
  public favorByAttribute(attribute: string): bool {
    return this.favorCollection(this.getCollectionByAttribute(attribute));
  }

  // Favor collection by attribute
  private favorCollection(collection: Collection): bool {
    if (!collection.get('index')) return false;
    // current address
    const address = my.getSender().toString();

    // cannot favor your owned collection, except developer
    if (collection.get('creator') == address && address != this.owner) return false;
    const favorCount = parseInt(collection.get('favorCount'), 10);
    collection.set('favorCount', (<u32>(favorCount + 1)).toString());
    return true;
  }

  // Get cryptofish collection by index(u32)
  // "getCollectionByIndex(int)[1]" => "collection(Map<string, string>)"
  public getCollectionByIndex(index: u32): Collection {
    const collection = this.collections[index];
    this.log(`getCollectionByIndex(${index}) =>`);
    this.printCollection(collection);
    return collection;
  }

  // Get cryptofish collection by attribute(string)
  // "getCollectionByAttribute(string)[123456]" => "collection(Map<string, string>)"
  public getCollectionByAttribute(attribute: string): Collection {
    let collection!: Collection;
    for (let index = 0; index < this.collections.length; index += 1) {
      const current = this.collections[index];
      if (current.get('attribute') == attribute) {
        collection = current;
        break;
      }
    }
    this.log(`getCollectionByAttribute(${attribute}) =>`);
    this.printCollection(collection);
    return collection;
  }

  public getCollectionCount(): u32 {
    return <u32>this.collections.length;
  }

  // Get owned collections
  // "getOwnedCollections()" => "collection[](Array<Map<string, string>>)"
  public getOwnedCollections(): Collection[] {
    const address: string = my.getSender().toString();
    const collections: Collection[] = [];
    for (let index = 0; index < this.collections.length; index += 1) {
      const collection = this.collections[index];
      if (collection.get('creator') != address) continue;
      collections.push(collection);
    }
    this.log(`getOwnedCollections: ${collections.length}`);
    this.printCollections(collections);
    return collections;
  }

  // Get all collections with limit and skip filter
  // "getCollections(int, int)[20, 0]" => "collection[](Array<Map<string, string>>)"
  public getCollections(limit: u32, skip: u32): Collection[] {
    const collections = this.collections.slice(skip, skip + limit);
    this.printCollections(collections);
    return collections;
  }

  // TODO: Test function, should be removed
  public logAll(): void {
    this.log(`total: ${this.collections.length}`);
    this.printCollections(this.collections);
    this.log(my.getTxHash());
  }

  // Generate unique attribute
  private generateUniqAttribute(): Attribute {
    // TODO: how to generate random and unique attribute
    let seed = 123456;
    while (!this.isAttributeAvailable(seed.toString())) {
      seed += 1;
    }
    return seed.toString();
  }

  // Calculate score by attribute
  private calculateScore(attribute: Attribute): u32 {
    const attrStrList: string[] = attribute.split('');
    const attrU32List: u32[] = attrStrList.map<u32>((hex) => parseHex2Int(hex));
    let score: u32 = 0;

    // Prevent to use `reduce` because of the closures issue in assemblyscript
    for (let index = 0; index < attrU32List.length; index++) {
      const currentScore = attrU32List[index];
      const weight = this.attributeWeights.get(this.attributeKeyList[index]) || 100;
      score += currentScore * weight;
    }
    return score;
  }

  // Attribute should be available and unique
  private isAttributeAvailable(attribute: Attribute): bool {
    // Should be unique
    for (let index = 0; index < this.collections.length; index += 1) {
      if (this.collections[index].get('attribute') == attribute) return false;
    }

    // Should be contained in attributes range
    const currentAttrList: string[] = attribute.split('');
    const keyList = this.attributeKeyList;
    for (let index = 0; index < keyList.length; index += 1) {
      const attributeRangeString = this.attributes.get(keyList[index]); // such as `0123456789`
      // make sure each attribute's value under the attributes range rule
      if (!attributeRangeString || !attributeRangeString.split('').includes(currentAttrList[index])) {
        this.log(`error: attribute(${attribute}) is not available(${keyList[index]}: ${attributeRangeString})`);
        return false;
      }
    }

    // Congratulations! Your generated attribute is available.
    return true;
  }

  // Print collections to stdout
  private printCollections(c: Collection[]): void {
    for (let index = 0; index < c.length; index += 1) {
      this.printCollection(c[index]);
    }
  }

  // Print collection to stdout
  private printCollection(c: Collection): void {
    const index = c.get('index');
    if (!index) {
      this.log('error: collection not found');
    }
    const creator = c.get('creator');
    const attribute = c.get('attribute');
    const score = c.get('score');
    const favorCount = c.get('favorCount');
    this.log(
      `Collection{index:${index}, creator:"${creator}", attribute:"${attribute}", score:${score}, favor:${favorCount}}`,
    );
  }

  // Common log method, use [cryptofish] as prefix
  private log(message: string): void {
    my.println(`[cryptofish] ${message}`);
  }
}
