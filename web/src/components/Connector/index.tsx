import * as React from 'react';
import { Button, Tooltip } from 'antd';
import type { IConnectorProps, IConnectorRef } from './IConnector';
import { useAntchain } from '@antchain/jssdk/react';
import { Avatar } from './Avatar';
import { DownloadHelper } from './DownloadHelper';
import { ConnectHelper } from './ConnectHelper';
import styled from 'styled-components';

export const Connector = React.forwardRef<IConnectorRef, IConnectorProps>(({ size }, ref) => {
  const {
    loading,
    isInstalled,
    antchain,
    data: {
      chainId,
      accounts: [account],
    },
  } = useAntchain();

  const isConnected = React.useMemo(() => !!account?.accountAddress, [account]);

  React.useImperativeHandle(
    ref,
    () => ({
      name: account.accountName,
      address: account.accountAddress,
    }),
    [account],
  );

  if (loading)
    return (
      <Button size={size} shape="round" loading>
        加载中...
      </Button>
    );
  if (!isInstalled) return <DownloadHelper size={size} />;
  if (!isConnected) return <ConnectHelper size={size} />;

  return (
    <Tooltip title={account.accountAddress}>
      <Button size={size} shape="round" type="primary" icon={<Avatar size={size} address={account.accountAddress} />}>
        {account.accountName}
      </Button>
    </Tooltip>
  );
});
