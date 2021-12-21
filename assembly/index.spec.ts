import CryptoFishContract from './index';

function init(): CryptoFishContract {
  return new CryptoFishContract();
}

describe('CryptoFish Contract', () => {
  it('should create contract successfully', () => {
    const contract = init();
    expect<CryptoFishContract>(contract).toBe(contract, 'Reference Equality');
    expect<string>(contract.ruleHash).not.toBeFalsy();
    expect<string>(contract.standard).toBe('CryptoFish');
  });

  it('should mint collection successfully', () => {
    const contract = init();
    const result = contract.mint();
    expect(result).toBe(true, 'mint');
  });

  it('should return collection when getCollectionByIndex', () => {
    const contract = init();
    const collection = contract.getCollectionByIndex(0);

    expect(collection.get('index')).toBe('0', 'index');
    expect(collection.get('attribute').length).toBe(6, 'attribute');
    expect(collection.get('creator')).toBeTruthy('creator');
    expect(collection.get('favorCount')).toBe('0', 'favorCount');
  });

  it('should return collection when getCollectionByAttribute', () => {
    const contract = init();
    const attribute = contract.getCollectionByIndex(0).get('attribute');
    const collection = contract.getCollectionByAttribute(attribute);

    expect(collection.get('index')).toBe('0', 'index');
    expect(collection.get('attribute').length).toBe(6, 'attribute');
    expect(collection.get('creator')).toBeTruthy('creator');
    expect(collection.get('favorCount')).toBe('0', 'favorCount');
  });

  it('should work with favorByIndex', () => {
    const contract = init();
    const result = contract.favorByIndex(0);
    expect(result).toBe(true);

    const collection = contract.getCollectionByIndex(0);
    expect(collection.get('favorCount')).toBe('1', 'favorCount');
  });

  it('should work with favorByAttribute', () => {
    const contract = init();
    const attribute = contract.getCollectionByIndex(0).get('attribute');

    const result = contract.favorByAttribute(attribute);
    expect(result).toBe(true);

    const collection = contract.getCollectionByAttribute(attribute);
    expect(collection.get('favorCount')).toBe('1', 'favorCount');
  });

  it('should work with getOwnedCollections', () => {
    const contract = init();
    const collections = contract.getOwnedCollections();
    expect(collections.length).toBe(1);

    const result = contract.mint();
    expect(result).toBe(true);

    const newCollections = contract.getOwnedCollections();
    expect(newCollections.length).toBe(2);
  });

  it('should work with getCollectionCount', () => {
    const contract = init();
    const count = contract.getCollectionCount();
    expect(count).toBe(1);

    const result = contract.mint();
    expect(result).toBe(true);

    const newCount = contract.getCollectionCount();
    expect(newCount).toBe(2);
  });
});
