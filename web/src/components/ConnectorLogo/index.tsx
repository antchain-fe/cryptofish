import * as React from 'react';
import styled from 'styled-components';
import connectorLogo from './connector-logo.png';

export interface IConnectorLogo {
  style?: React.CSSProperties;
  className?: string;
  size?: number;
}

const StyledImg = styled.img<{ size: number }>`
  vertical-align: text-bottom;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  margin-right: 8px;
`;

export const ConnectorLogo: React.FC<IConnectorLogo> = ({ style, className, size = 16 }) => {
  return <StyledImg src={connectorLogo} alt="logo" size={16} />;
};
