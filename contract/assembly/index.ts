import { my, Storage, BaseContract } from '@antchain/myassembly';
import { Address, Attribute, AttributeType, Collection } from './types';
import { parseHex2Int, stringifyCollection, stringifyCollections } from './utils';

export default class CryptoFishContract extends BaseContract {
  // TODO: You can use this hash to verify the image file containing all the fish
  public ruleHash: string = 'xxxxxxxx';
  // CryptoFish standard name
  public standard: string = 'CryptoFish';

  // Collection count limit per address
  private limit: u32;
  // Mint available, depend on developer
  private canMint: Storage<bool> = new Storage('canMint', true);
  // CryptoFish contract owner's address
  private owner: Storage<Address> = new Storage('owner', '');
  // Collections list
  private collections: Storage<Collection[]> = new Storage('collections', []);
  private collectionAttributeMap: Storage<Map<Attribute, bool>> = new Storage(
    'collectionAttributeMap',
    new Map<Attribute, bool>(),
  );
  // Picked logo collection
  private logo: Storage<Collection> = new Storage('logo', new Map<string, string>());
  private isLogoPicked: Storage<bool> = new Storage('isLogoPicked', false);

  // Private builtin attributes infos
  // attribute key list depends on rule hash
  private attributeKeyList: AttributeType[] = ['skin', 'background', 'frame', 'fin', 'eye', 'tail'];
  private attributeWeights: Map<AttributeType, u32> = new Map<AttributeType, u32>();
  private attributes: Map<AttributeType, string> = new Map<AttributeType, string>();

  constructor() {
    super();

    this.limit = 20;

    // prepare attribute weights
    // `skin/background/frame` has double weights than others when calculating score
    this.attributeWeights.set('skin', 200);
    this.attributeWeights.set('background', 200);
    this.attributeWeights.set('frame', 200);
    this.attributeWeights.set('fin', 100);
    this.attributeWeights.set('eye', 100);
    this.attributeWeights.set('tail', 100);

    // prepare attributes
    this.attributes.set('skin', '0123456789');
    this.attributes.set('background', '0123456789AB');
    this.attributes.set('frame', '0123456789AB');
    this.attributes.set('fin', '0123456789');
    this.attributes.set('eye', '0123456789');
    this.attributes.set('tail', '0123456789');
  }

  // onDeploy callback, only for developers
  public onContractDeploy(): void {
    // Prepare contract when deploy contract
    if (this.owner.get().length > 0) {
      throw new Error('[cryptofish] cannot run this method');
    }
    // Record the contract developer as owner
    const ownerAddress = my.getSender().toString();
    this.owner.set(ownerAddress);

    this.log(`contract created by: ${ownerAddress}`);

    // Grant the first(index: 0) collection to our developer.
    this.mint();
  }

  // Mint collection for current address
  public mint(): bool {
    // current address
    const creator = my.getSender().toString();
    const ownedCount = <u32>this.getOwnedCollectionsPrivate().length;
    const canMint = this.canMint.get();
    const isOwner = this.isOwner();

    // Limit for each address(see `this.limit`)
    // Developers are not restricted
    if (ownedCount >= this.limit && !isOwner) {
      this.log(`error: you cannot own more than ${this.limit} collections(${creator})`);
      return false;
    }

    // Mint available
    // Developers are not restricted
    if (!canMint && !isOwner) {
      this.log(`error: ${this.standard} minting is not available`);
      return false;
    }

    // generate unique and available attribute
    const attribute = this.generateUniqAttribute();
    const collections = this.collections.get();
    const collectionAttributeMap = this.collectionAttributeMap.get();
    const index = collections.length;

    const collection: Collection = new Map<string, string>();
    collection.set('index', index.toString());
    collection.set('creator', creator);
    collection.set('attribute', attribute);
    collection.set('score', this.calculateScore(attribute).toString());
    collection.set('favorCount', '0');

    this.log('mint collection success:');
    this.printCollection(collection);

    // save to chain
    collections.push(collection);
    this.collections.set(collections);
    // mark attribute
    collectionAttributeMap.set(attribute, true);
    this.collectionAttributeMap.set(collectionAttributeMap);
    return true;
  }

  // Set canMint var, only for developers
  public setCanMint(canMint: u32): void {
    if (this.isOwner()) {
      this.canMint.set(canMint === 0 ? false : true);
    }
  }

  // Pick logo in current collections range
  public pickLogoByScore(): bool {
    // Only for developers
    if (!this.isOwner()) {
      this.log('error: you do not have permission to pick logo');
      return false;
    }
    // Can only been picked once
    const isLogoPicked = this.isLogoPicked.get();
    if (isLogoPicked) {
      const logo = this.logo.get();
      this.log(`error: logo has been picked:`);
      this.printCollection(logo);
      return false;
    }
    let logo!: Collection;
    let logoScore: u32 = 0;
    const collections = this.collections.get();
    for (let index = 0; index < collections.length; index += 1) {
      const collection = collections[index];
      if (!collection || !collection.get('index')) continue;
      const currentScore = <u32>parseInt(collection.get('score'), 10);
      if (currentScore > logoScore) {
        logo = collection;
        logoScore = currentScore;
      }
    }
    this.logo.set(logo);
    this.isLogoPicked.set(true);
    this.log(`pickLogoByScore success(${logoScore})`);
    this.printCollection(logo);
    return true;
  }

  // Get picked logo collection
  public getLogo(): string {
    const isLogoPicked = this.isLogoPicked.get();
    if (!isLogoPicked) {
      throw new Error('[cryptofish] logo has not been picked, please wait');
    }
    const logo = this.logo.get();
    this.log('get logo success:');
    this.printCollection(logo);
    return stringifyCollection(logo);
  }

  // Favor collection by #Index
  // "favorByIndex(int)[0]" => "true/false"
  public favorByIndex(index: u32): bool {
    return this.favorCollectionByIndex(index, this.getCollectionByIndexPrivate(index));
  }

  // Favor collection by attribute
  // "favorByAttribute(string)[123456]" => "true/false"
  public favorByAttribute(attribute: string): bool {
    const collections = this.collections.get();
    let idx!: u32;
    let collection!: Collection;
    for (let index = 0; index < collections.length; index += 1) {
      const current = collections[index];
      if (current.get('attribute') == attribute) {
        idx = index;
        collection = current;
        break;
      }
    }
    return this.favorCollectionByIndex(idx, collection);
  }

  // Favor collection by attribute
  private favorCollectionByIndex(index: u32, collection: Collection): bool {
    if (!collection.get('index')) return false;
    // current address
    const address = my.getSender().toString();

    // cannot favor your owned collection, except developer
    if (collection.get('creator') == address && !this.isOwner()) return false;
    const favorCount = parseInt(collection.get('favorCount'), 10);
    collection.set('favorCount', (<u32>(favorCount + 1)).toString());
    this.updateCollectionByIndex(index, collection);
    return true;
  }

  private updateCollectionByIndex(index: u32, collection: Collection): void {
    const collections = this.collections.get();
    collections[<i32>index] = collection;
    this.collections.set(collections);
  }

  // Get cryptofish collection by index(u32)
  // "getCollectionByIndex(int)[1]" => "collection(Map<string, string>)"
  public getCollectionByIndex(index: u32): string {
    return stringifyCollection(this.getCollectionByIndexPrivate(index));
  }
  public getCollectionByIndexPrivate(index: u32): Collection {
    const collections = this.collections.get();
    const collection = collections[index];
    this.log(`getCollectionByIndex(${index}) =>`);
    this.printCollection(collection);
    return collection;
  }

  // Get cryptofish collection by attribute(string)
  // "getCollectionByAttribute(string)[123456]" => "collection(Map<string, string>)"
  public getCollectionByAttribute(attribute: string): string {
    return stringifyCollection(this.getCollectionByAttributePrivate(attribute));
  }
  public getCollectionByAttributePrivate(attribute: string): Collection {
    const collections = this.collections.get();
    let collection!: Collection;
    for (let index = 0; index < collections.length; index += 1) {
      const current = collections[index];
      if (current.get('attribute') == attribute) {
        collection = current;
        break;
      }
    }
    this.log(`getCollectionByAttribute(${attribute}) =>`);
    this.printCollection(collection);
    return collection;
  }

  // Get owned collections
  // "getOwnedCollections()" => "collection[](Array<Map<string, string>>)"
  public getOwnedCollections(): string {
    return stringifyCollections(this.getOwnedCollectionsPrivate());
  }
  public getOwnedCollectionsPrivate(): Collection[] {
    const address: string = my.getSender().toString();
    const totalCollections = this.collections.get();
    const collections: Collection[] = [];
    for (let index = 0; index < totalCollections.length; index += 1) {
      const collection = totalCollections[index];
      if (collection.get('creator') != address) continue;
      collections.push(collection);
    }
    this.log(`getOwnedCollections: ${collections.length}`);
    this.printCollections(collections);
    return collections;
  }

  public getCollectionCount(): u32 {
    return <u32>this.collections.get().length;
  }

  // Get all collections with limit and skip filter
  // "getCollections(int, int)[20, 0]" => "collection[](Array<Map<string, string>>)"
  public getCollections(limit: u32, skip: u32): string {
    return stringifyCollections(this.getCollectionsPrivate(limit, skip));
  }
  public getCollectionsPrivate(limit: u32, skip: u32): Collection[] {
    const collections = this.collections.get();
    const collectionsPart = collections.slice(skip, skip + limit);
    this.printCollections(collectionsPart);
    return collectionsPart;
  }

  // Generate unique attribute
  private generateUniqAttribute(): Attribute {
    const txHash = my.getTxHash();
    const skinRange = this.attributes.get('skin').length;
    const backgroundRange = this.attributes.get('background').length;
    const frameRange = this.attributes.get('frame').length;
    const finRange = this.attributes.get('fin').length;
    const eyeRange = this.attributes.get('eye').length;
    const tailRange = this.attributes.get('tail').length;

    for (let index = 0; index < txHash.length - 6; index += 1) {
      const sourceAttribute = txHash.substr(index, 6).split('');
      const skin = parseHex2Int(sourceAttribute[0]) % skinRange;
      const background = parseHex2Int(sourceAttribute[1]) % backgroundRange;
      const frame = parseHex2Int(sourceAttribute[2]) % frameRange;
      const fin = parseHex2Int(sourceAttribute[3]) % finRange;
      const eye = parseHex2Int(sourceAttribute[4]) % eyeRange;
      const tail = parseHex2Int(sourceAttribute[5]) % tailRange;
      const attribute = `${skin.toString()}${background.toString()}${frame.toString()}${fin.toString()}${eye.toString()}${tail.toString()}`;
      if (this.isAttributeAvailable(attribute)) return attribute;
    }
    throw new Error('[cryptofish] cannot generate attribute');
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
    const collectionAttributeMap = this.collectionAttributeMap.get();
    if (collectionAttributeMap.has(attribute) && collectionAttributeMap.get(attribute) === true) {
      return false;
    }

    // Should be contained in attributes range

    // Congratulations! Your generated attribute is available.
    return true;
  }

  // Get is owner(developer)
  private isOwner(): bool {
    return this.owner.get() == my.getSender().toString();
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
    my.log(`[cryptofish] ${message}`, []);
  }
}
