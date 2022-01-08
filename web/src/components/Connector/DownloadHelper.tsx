import * as React from 'react';
import { Button, Card, Divider, Modal, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export interface IDownloadHelperProps {
  size?: any;
}

const FullWidthSpace = styled(Space)`
  width: 100%;
`;

export const DownloadHelper: React.FC<IDownloadHelperProps> = ({ size }) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <Modal visible={visible} title="下载蚂蚁链连接器插件" footer={null} onCancel={() => setVisible(false)}>
        <FullWidthSpace size="large" direction="vertical">
          <span>
            您可以访问
            <a href="https://opendocs.antchain.antgroup.com/myfish/dapp-connector" target="_blank">
              蚂蚁链开发者知识库
            </a>
            ，查看连接器使用方式
          </span>
          <Card
            title="Chrome 插件"
            bodyStyle={{ padding: 0 }}
            extra={
              <>
                <a
                  href="https://chrome.google.com/webstore/detail/%E8%9A%82%E8%9A%81%E9%93%BE%E8%BF%9E%E6%8E%A5%E5%99%A8/ebmdohapebmbddpncmgehmocbbfoegjm"
                  target="_blank"
                >
                  Chrome 商店下载
                </a>
                <Divider type="vertical" />
                <a
                  href="https://opendocs.antchain.antgroup.com/myfish/dapp-connector"
                  target="_blank"
                >
                  ZIP 包下载
                </a>
              </>
            }
          />
          {/* <Card title="Safari 插件" bodyStyle={{ padding: 0 }} extra={<Button type="link">下载</Button>} />
          <Card title="Edge 插件" bodyStyle={{ padding: 0 }} extra={<Button type="link">下载</Button>} /> */}
        </FullWidthSpace>
      </Modal>
      <Button size={size} shape="round" type="primary" icon={<DownloadOutlined />} onClick={() => setVisible(true)}>
        下载蚂蚁链连接器
      </Button>
    </>
  );
};
