import * as React from 'react';
import { useAntchain, Contract } from '@antchain/jssdk/react';
import abi from '@/abis/cryptofish.json';

const contractName = abi.contract_git_id;

export function useAntChain() {
  const value = useAntchain();
  const { isInstalled = false, antchain, data } = value ?? {};
  const account = data?.accounts?.[0];
  const [contract, setContract] = React.useState<Contract | null>(null);

  const isConnected = React.useMemo(() => !!account?.accountAddress, [account?.accountAddress]);
  React.useEffect(() => {
    if (antchain && isConnected) {
      setContract(new Contract({ contractName, abi }, antchain));
    } else {
      setContract(null);
    }
  }, [isConnected, !!antchain]);
  return {
    chainId: data?.chainId,
    name: account?.accountName,
    address: account?.accountAddress,
    isConnected,
    isInstalled,
    contract,
  };
}
