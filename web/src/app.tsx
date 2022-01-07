import * as React from 'react';
import { AntchainProvider } from '@antchain/jssdk/react';

export function rootContainer(container: React.ReactElement) {
  return React.createElement(AntchainProvider, null, container);
}
