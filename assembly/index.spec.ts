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

  it('should work with getCollections', () => {
    const contract = init();
    for (let index = 0; index < 10; index += 1) {
      contract.mint();
    }

    const c1 = contract.getCollections(3, 0);
    expect(c1.length).toBe(3);
    expect(c1[0].get('index')).toBe('0');
    expect(c1[1].get('index')).toBe('1');
    expect(c1[2].get('index')).toBe('2');

    const c2 = contract.getCollections(3, 3);
    expect(c2.length).toBe(3);
    expect(c2[0].get('index')).toBe('3');
    expect(c2[1].get('index')).toBe('4');
    expect(c2[2].get('index')).toBe('5');
  });
});