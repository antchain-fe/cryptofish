import * as React from 'react';
import { Row, Col, Card, Skeleton, Space } from 'antd';
import { useRequest, useParams } from 'umi';
import { CollectionCard, ICollection } from '@/components/CollectionsCard';
import { useAntChain } from '@/hooks/useAntChain';
import { message } from 'antd';
import { Canvas } from '@/components/Canvas';
import { string2Attribute } from '@/common/attribute';

const CollectionDetailPage: React.FC<unknown> = () => {
  const { id } = useParams<{ id: string }>();
  const index = React.useMemo(() => Number(id), [id]);
  const { contract, isConnected } = useAntChain();

  const { loading, data: collection } = useRequest(
    async () => {
      const { returnValue } = await contract!.call<string>({
        methodName: 'getCollectionByIndex',
        args: [index],
      });
      return { data: JSON.parse(returnValue) as ICollection };
    },
    {
      ready: !!contract && !!index,
      onError: (err) => message.error(err.message),
    },
  );

  if (loading) return <Skeleton avatar paragraph={{ rows: 4 }} style={{ width: 800, padding: '40px 0' }} />;
  if (!loading && !collection?.attribute) return <div>error</div>;
  return (
    <Row gutter={16} style={{ padding: '40px 0', width: 900 }}>
      <Col span={8}>
        <Canvas attribute={string2Attribute(collection?.attribute!)} ratio={8} />
      </Col>
      <Col span={16}>
        <Card title={`CryptoFish #${collection?.index}`}>
          <p>特征编码: {collection?.attribute}</p>
          <p>所有者地址: {collection?.creator}</p>
          <p>点赞数: {collection?.favorCount}</p>
        </Card>
      </Col>
    </Row>
  );
};
export default CollectionDetailPage;
