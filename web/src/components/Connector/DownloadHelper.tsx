import * as React from 'react';
import { Button, Card, Modal, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const FullWidthSpace = styled(Space)`
  width: 100%;
`;

export const DownloadHelper: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <Modal visible={visible} title="下载蚂蚁链连接器插件" footer={null} onCancel={() => setVisible(false)}>
        <FullWidthSpace size="large" direction="vertical">
          <Card title="Chrome 插件" bodyStyle={{ padding: 0 }} extra={<Button type="link">下载</Button>} />
          <Card title="Safari 插件" bodyStyle={{ padding: 0 }} extra={<Button type="link">下载</Button>} />
          <Card title="Edge 插件" bodyStyle={{ padding: 0 }} extra={<Button type="link">下载</Button>} />
        </FullWidthSpace>
      </Modal>
      <Button shape="round" icon={<DownloadOutlined />} onClick={() => setVisible(true)}>
        下载蚂蚁链连接器
      </Button>
    </>
  );
};
