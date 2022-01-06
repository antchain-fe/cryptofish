import * as React from 'react';
import { Avatar as AntdAvatar, ButtonProps } from 'antd';
import jazzicon from '@metamask/jazzicon';
import styled from 'styled-components';

export interface IAvatarProps {
  address: string;
  size?: ButtonProps['size'];
}

const StyledAvatar = styled(AntdAvatar)`
  margin-right: 12px;
  & > img {
    object-fit: fill;
  }
`;

export const Avatar: React.FC<IAvatarProps> = ({ address, size = 'middle' }) => {
  let sizeNum = 0;
  switch (size) {
    case 'large':
      sizeNum = 24;
      break;
    case 'middle':
      sizeNum = 18;
      break;
    case 'small':
      sizeNum = 16;
      break;
    default:
      sizeNum = 20;
      break;
  }
  const svg = React.useMemo(() => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" version="1.2">${
      jazzicon(sizeNum, address).innerHTML
    }</svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
  }, [address, sizeNum]);

  return <StyledAvatar size={sizeNum} icon={<img src={svg} alt="jazzicon" />} />;
};
