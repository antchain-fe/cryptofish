import * as React from 'react';
import type { IConnectorProps } from './IConnector';
import { useAntchain } from '@antchain/jssdk/react';
import { Avatar } from './Avatar';
import { DownloadHelper } from './DownloadHelper';

export const Connector: React.FC<IConnectorProps> = () => {
  const {
    loading,
    isInstalled,
    antchain,
    data: {
      chainId,
      accounts: [account],
    },
  } = useAntchain();

  const isConnected = React.useMemo(() => !!account, [account]);

  console.log(loading, isInstalled, isConnected, chainId, account);

  if (loading) return <div>Loading...</div>;
  if (!isInstalled) return <DownloadHelper />;
  return (
    <div>
      <Avatar address="406faa3c165c25a5ff520cee19dd51146283fcabfcdaa490477a7b4be7f97e8a" />
    </div>
  );
};

// TODO: refactor to umi-plugin-myfish
export { AntchainProvider } from '@antchain/jssdk/react';
