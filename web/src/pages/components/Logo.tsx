import * as React from 'react';
import styled from 'styled-components';
import { useInterval } from 'ahooks';
import { Canvas } from '@/components/Canvas';
import { Attribute, getRandomAttribute } from '@/common/attribute';

const BorderedCanvas = styled(Canvas)`
  border-radius: 5px;
`;

export const Logo: React.FC<unknown> = () => {
  const [attribute, setAttribtue] = React.useState<Record<Attribute, string>>(getRandomAttribute());
  useInterval(() => {
    setAttribtue(getRandomAttribute());
  }, 1000);
  return <BorderedCanvas ratio={6} attribute={attribute} />;
};
