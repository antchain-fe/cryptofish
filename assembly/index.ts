import { my, BaseContract } from '@antchain/myassembly';
import { Address, Attribute, Collection } from './types';
import { parseHex2Int } from './utils';

export default class CryptoFishContract extends BaseContract {
  // TODO: You can use this hash to verify the image file containing all the fish
  public ruleHash: string;
  // CryptoFish standard name
  public standard: string = 'CryptoFish';

  // Collection count limit per address
  private limitPerAddress: i32;
  // CryptoFish contract owner's address
  private owner: Address;
  // Collections list
  private collections: Collection[] = [];

  constructor() {
    super();
    // TODO: move from mockConstructor
  }

  // TODO: for local test
  public mockConstructor(): void {
    // Record the contract developer as owner
    this.owner = my.getSender().toString();
    this.limitPerAddress = 100;
    this.log(`contract created by: ${this.owner}`);

    // Grant the first(index: 0) collection to our developer.
    this.mint();
  }

  // Mint collection for current address
  public mint(): bool {
    const creator = my.getSender().toString();

    // TODO: creator != this.owner no limit for developer
    if (this.getOwnedCollections().length >= this.limitPerAddress) {
      this.log(`error: you cannot own more than ${this.limitPerAddress} collections(${creator})`);
      return false;
    }

    const attribute = this.generateUniqAttribute();
    const index = this.collections.length;

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

  // Get cryptofish collection by index(u32)
  // "getCollectionByIndex(int)[1]" => "collection(Map<string, string>)"
  public getCollectionByIndex(index: u32): Collection {
    const collection = this.collections[index];
    my.println(`getCollectionByIndex(${index}) => ${collection.get('attribute')}`);
    return collection;
  }

  // Get owned collections
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

  // TODO: Test function, should be removed
  public logAll(): void {
    this.log(`total: ${this.collections.length}`);
    this.printCollections(this.collections);
  }

  // Generate unique attribute
  private generateUniqAttribute(): Attribute {
    // TODO: how to generate random and unique attribute
    return '123456';
  }

  // Calculate score by attribute
  private calculateScore(attribute: Attribute): u32 {
    const attrStrList: string[] = attribute.split('');
    const attrU32List: u32[] = attrStrList.map<u32>((hex) => parseHex2Int(hex));
    return attrU32List.reduce<u32>((pv, cv) => pv + cv, 0);
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
