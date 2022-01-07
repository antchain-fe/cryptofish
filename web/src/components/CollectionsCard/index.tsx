import * as React from 'react';
import { Card, Tooltip } from 'antd';
import { string2Attribute } from '@/common/attribute';
import { Canvas } from '../Canvas';
import { history } from 'umi';
import { formatAddress } from '@/common/utils';

export interface ICollection {
  index: number;
  creator: string;
  favorCount: number;
  attribute: string;
  score: number;
}

export interface ICollectionCardProps {
  collection: ICollection;
}

export const CollectionCard: React.FC<ICollectionCardProps> = ({ collection }) => {
  const attribute = string2Attribute(collection.attribute);
  return (
    <Card
      hoverable
      style={{ width: 206 }}
      onClick={() => {
        history.push(`/collections/${collection.index}`);
      }}
      cover={<Canvas ratio={6} attribute={attribute!} />}
    >
      <Card.Meta
        title={`cryptofish #${collection.index}`}
        description={
          <>
            <div>特征值: {collection.attribute}</div>
            <div>
              铸造者: <Tooltip title={collection.creator}>{formatAddress(collection.creator)}</Tooltip>
            </div>
            <div>点赞数: {collection.favorCount}</div>
          </>
        }
      />
    </Card>
  );
};
