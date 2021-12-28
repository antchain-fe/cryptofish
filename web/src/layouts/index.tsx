import * as React from 'react';
import { Anchor, Typography, Button } from 'antd';
import { Connector, AntchainProvider } from '@/components/Connector';
import { Layout, Header, Content, Footer, GlobalStyle } from './components/Layout';

const MainLayout: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <AntchainProvider>
      <Layout>
        <GlobalStyle />
        <Anchor>
          <Header>
            <Typography.Title level={3} style={{ margin: 0 }}>
              cryptofish
            </Typography.Title>
            <Connector />
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
    </AntchainProvider>
  );
};
MainLayout.displayName = 'MainLayout';
export default MainLayout;
