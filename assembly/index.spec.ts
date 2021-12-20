import CryptoFishContract from './index';

describe('CryptoFish Contract', () => {
  it('should create contract successfully', () => {
    const contract = new CryptoFishContract();
    expect<CryptoFishContract>(contract).toBe(contract, 'Reference Equality');
    expect<string>(contract.ruleHash).not.toBeFalsy();
    expect<string>(contract.standard).toBe('CryptoFish');
  });
});
