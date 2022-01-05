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
              <Typography.Title>Myfish 加密鱼</Typography.Title>
              <Typography.Paragraph>
                Myfish 加密鱼（CryptoFish）是通过 <a href="https://opendocs.antchain.antgroup.com/myfish">Myfish</a>{' '}
                工具链开发、运行在<a href="https://antchain.antgroup.com/">蚂蚁链</a>实验链上的一款分布式应用（DApp）。
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
                为纪念 <a href="https://seeconf.antfin.com/">SEEConf 2022</a> 大会上 Myfish 对外开放公测，大家可以通过这个 DApp
                来参与 Myfish 的 Logo 共创。这是一个分布式应用的实验，每个人都可以参与。
                我们提供一份纪念品（SEEConf 的卫衣+CryptoFish 的贴纸）奖励最后创造出 Logo 的用户。
              </Typography.Paragraph>
              <Typography.Paragraph>
                每个账号可以通过这个应用调用我们部署在实验链上的智能合约，智能合约的逻辑会随机的生成一个 Logo，每个 Logo 都有一个属性分。
                我们会选择属性分最高的 Logo 来作为 Myfish 最终的 Logo。
              </Typography.Paragraph>
              <Typography.Paragraph>
                CryptoFish 生成 Logo 的逻辑都是通过智能合约实现，源代码开放，程序分布式的运行在区块链上，由区块链来确保这个纪念活动的公平透明。
                获得奖励的用户请联系我们，我们会将纪念品寄出。<a href="https://www.yuque.com/antchain-fe/blog/cryptofish">了解更多</a>。
              </Typography.Paragraph>
            </Typography>
          </MainCard>
        </Space>
      </Space>
    </FullSpace >
  );
};
export default HomePage;
