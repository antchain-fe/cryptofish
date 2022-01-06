import { Layout as AntdLayout } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';

export const Layout = styled(AntdLayout)`
  height: 100%;
`;

export const GlobalStyle = createGlobalStyle`
  #root {
    height: 100%;
  }
`;

export const Header = styled(AntdLayout.Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Content = styled(AntdLayout.Content)`
  display: flex;
  justify-content: center;
  flex-shrink: 0;
`;

export const Footer = styled(AntdLayout.Footer)`
  display: flex;
  justify-content: center;
`;
