import * as React from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { ConnectorLogo } from '@/components/ConnectorLogo';
import { Logo } from './components';
import styled from 'styled-components';

const FullSpace = styled(Space)`
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const MainCard = styled(Card)`
  width: 500px;
`;

const HomePage: React.FC<unknown> = () => {
  return (
    <FullSpace align="center">
      <Space size="large" align="start" style={{ margin: '30px 0' }}>
        <Logo />
        <Space size="large" direction="vertical">
          <MainCard bordered={false}>
            <Typography>
              <Typography.Title>Myfish 纪念卡</Typography.Title>
              <Typography.Paragraph>
                Myfish 纪念卡（cryptofish）是通过 Myfish
                工具链开发、运行在蚂蚁链联盟链测试网的一款分布式应用（dApp），它包含智能合约和前端应用两部分。
              </Typography.Paragraph>
            </Typography>
            <Space>
              <Button type="primary" shape="round" icon={<ConnectorLogo />}>
                连接蚂蚁链
              </Button>
              <Button
                shape="round"
                href="https://github.com/antchain-fe/cryptofish/blob/main/contract/assembly/index.ts"
                target="_blank"
              >
                查看智能合约
              </Button>
              <Button
                icon={<GithubOutlined />}
                shape="round"
                href="https://github.com/antchain-fe/cryptofish"
                target="_blank"
              />
            </Space>
          </MainCard>
          <MainCard bordered={false}>
            <Typography>
              <Typography.Paragraph>
                为纪念 SEEConf 2022 大会上 Myfish 顺利发布，大家可以通过这个 DApp
                来领取「纪念卡」，每一个纪念卡都是独一无二的。
              </Typography.Paragraph>
              <Typography.Paragraph>
                同时我们会在大家领取的纪念卡中，通过预先写好的逻辑挑选一个作为 Myfish 的
                Logo，整个过程将自动完成无法人为干预。
              </Typography.Paragraph>
            </Typography>
          </MainCard>
        </Space>
      </Space>
    </FullSpace>
  );
};
export default HomePage;
