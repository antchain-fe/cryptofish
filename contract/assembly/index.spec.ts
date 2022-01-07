import CryptoFishContract from './index';

function init(): CryptoFishContract {
  const contract = new CryptoFishContract();
  contract.onContractDeploy();
  return contract;
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
    expect(result).not.toBe('null', 'mint');
  });

  it('should return collection when getCollectionByIndex', () => {
    const contract = init();
    const collection = contract.getCollectionByIndexPrivate(0);

    expect(collection.get('index')).toBe('0', 'index');
    expect(collection.get('attribute').length).toBe(6, 'attribute');
    expect(collection.get('creator')).toBeTruthy('creator');
    expect(collection.get('favorCount')).toBe('0', 'favorCount');
  });

  it('should return collection when getCollectionByAttribute', () => {
    const contract = init();
    const attribute = contract.getCollectionByIndexPrivate(0).get('attribute');
    const collection = contract.getCollectionByAttributePrivate(attribute);

    expect(collection.get('index')).toBe('0', 'index');
    expect(collection.get('attribute').length).toBe(6, 'attribute');
    expect(collection.get('creator')).toBeTruthy('creator');
    expect(collection.get('favorCount')).toBe('0', 'favorCount');
  });

  it('should work with favorByIndex', () => {
    const contract = init();
    const result = contract.favorByIndex(0);
    expect(result).toBe(true);

    const collection = contract.getCollectionByIndexPrivate(0);
    expect(collection.get('favorCount')).toBe('1', 'favorCount');
  });

  it('should work with favorByAttribute', () => {
    const contract = init();
    const attribute = contract.getCollectionByIndexPrivate(0).get('attribute');

    const result = contract.favorByAttribute(attribute);
    expect(result).toBe(true);

    const collection = contract.getCollectionByAttributePrivate(attribute);
    expect(collection.get('favorCount')).toBe('1', 'favorCount');
  });

  it('should work with getOwnedCollections', () => {
    const contract = init();
    const collections = contract.getOwnedCollectionsPrivate();
    expect(collections.length).toBe(1);

    const result = contract.mint();
    expect(result).not.toBe('null');

    const newCollections = contract.getOwnedCollectionsPrivate();
    expect(newCollections.length).toBe(2);
  });

  it('should work with getCollectionCount', () => {
    const contract = init();
    const count = contract.getCollectionCount();
    expect(count).toBe(1);

    const result = contract.mint();
    expect(result).not.toBe('null');

    const newCount = contract.getCollectionCount();
    expect(newCount).toBe(2);
  });

  it('should work with getCollections', () => {
    const contract = init();
    for (let index = 0; index < 6; index += 1) {
      const success = contract.mint();
      expect(success).not.toBe('null');
    }

    const c1 = contract.getCollectionsPrivate(3, 0);
    expect(c1.length).toBe(3);
    expect(c1[0].get('index')).toBe('0', '0');
    expect(c1[1].get('index')).toBe('1', '1');
    expect(c1[2].get('index')).toBe('2', '2');

    const c2 = contract.getCollectionsPrivate(3, 3);
    expect(c2.length).toBe(3);
    expect(c2[0].get('index')).toBe('3', '3');
    expect(c2[1].get('index')).toBe('4', '4');
    expect(c2[2].get('index')).toBe('5', '5');
  });

  it('should work with pickLogoByScore/getLogo', () => {
    const contract = init();
    const success = contract.mint();
    expect(success).not.toBe('null');

    expect(() => {
      const c = init();
      c.getLogo();
    }).toThrow();

    const result = contract.pickLogoByScore();
    expect(result).toBe(true);

    const logo = contract.getLogo();
    expect(!!logo).toBeTruthy();

    const result2 = contract.pickLogoByScore();
    expect(result2).toBe(false);
  });
});
