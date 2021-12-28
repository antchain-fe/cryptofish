import * as React from 'react';
import { Avatar as AntdAvatar, AvatarProps as AntdAvatarProps } from 'antd';
import jazzicon from '@metamask/jazzicon';

export interface IAvatarProps extends AntdAvatarProps {
  address: string;
  size?: number;
}

export const Avatar: React.FC<IAvatarProps> = ({ address, size = 64 }) => {
  const svg = React.useMemo(() => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" version="1.2">${
      jazzicon(size, address).innerHTML
    }</svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
  }, [address, size]);

  return <AntdAvatar icon={<img src={svg} alt="jazzicon" />} />;
};
