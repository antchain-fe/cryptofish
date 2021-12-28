import * as React from 'react';
import { Canvas } from '@/components/Canvas';
import { getRandomAttribute } from '@/common/attribute';

const PuzzlePage: React.FC<unknown> = () => {
  return (
    <div
      style={{
        width: 16 * 4 * 34,
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: 32 * 10 }).map(() => (
        <Canvas ratio={4} attribute={getRandomAttribute()} />
      ))}
    </div>
  );
};

export default PuzzlePage;
