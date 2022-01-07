import * as React from 'react';
import { Anchor, Typography } from 'antd';
import { history } from 'umi';
import { Connector } from '@/components/Connector';
import { Layout, Header, Content, Footer, GlobalStyle } from './components/Layout';

const MainLayout: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <Layout>
      <GlobalStyle />
      <Anchor>
        <Header>
          <Typography.Title onClick={() => history.push('/')} level={3} style={{ margin: 0, cursor: 'pointer' }}>
            CryptoFish
          </Typography.Title>
          <Connector size="large" />
        </Header>
      </Anchor>
      <Content>{children}</Content>
      <Footer>
        <Typography.Text>
          Made with ❤ by&nbsp;
          <Typography.Link target="_blank" rel="noopener noreferrer" href="https://www.yuque.com/antchain-fe/blog">
            AntChain FE
          </Typography.Link>
        </Typography.Text>
      </Footer>
    </Layout>
  );
};
MainLayout.displayName = 'MainLayout';
export default MainLayout;
