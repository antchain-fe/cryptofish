import * as React from 'react';
import styled from 'styled-components';
import { useInterval } from 'ahooks';
import { Canvas } from '@/components/Canvas';
import { Attribute, getRandomAttribute } from '@/common/attribute';

import img1 from '@/assets/logo/1.png';
import img2 from '@/assets/logo/2.png';
import img3 from '@/assets/logo/3.png';
import img4 from '@/assets/logo/4.png';
import img5 from '@/assets/logo/5.png';
import img6 from '@/assets/logo/6.png';
import img7 from '@/assets/logo/7.png';

const images = [img1, img2, img3, img4, img5, img6, img7];

const LogoContainer = styled.div`
  width: 204px;
  height: 204px;
  & img {
    border-radius: 5px;
    width: 100%;
  }
`;

export const Logo: React.FC<unknown> = () => {
  const [index, setIndex] = React.useState(0);

  useInterval(() => {
    setIndex(index + 1);
  }, 1000);

  return (
    <LogoContainer>
      <img src={images[index % images.length]} alt="logo-placeholder" />
    </LogoContainer>
  );
};
