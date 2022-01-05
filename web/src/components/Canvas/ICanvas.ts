import * as React from 'react';
import type { Attribute } from '@/common/attribute';

export interface ICanvasProps {
  attribute: Record<Attribute, string>;
  ratio?: number;
  style?: React.CSSProperties;
  className?: string;
}

export interface ICanvasRef {
  toDataURL: (type?: string, quality?: any) => string | void;
}
