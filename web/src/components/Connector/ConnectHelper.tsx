import * as React from 'react';
import { Button, message } from 'antd';
import { useAntchain } from '@antchain/jssdk/react';
import { ConnectorLogo } from '../ConnectorLogo';

export interface IConnectHelperProps {
  size?: any;
}

export const ConnectHelper: React.FC<IConnectHelperProps> = ({ size }) => {
  const [loading, setLoading] = React.useState(false);
  const { antchain } = useAntchain();
  return (
    <Button
      size={size}
      shape="round"
      type="primary"
      icon={<ConnectorLogo />}
      loading={loading}
      onClick={async () => {
        try {
          setLoading(true);
          await antchain.requestAccounts();
          setLoading(false);
        } catch (error: any) {
          message.error(error?.message ?? '连接蚂蚁链失败');
          setLoading(false);
        }
      }}
    >
      连接蚂蚁链
    </Button>
  );
};
