import * as React from 'react';
import { Row, Col, Divider, Button, Space, Skeleton } from 'antd';
import { history, useRequest } from 'umi';
import { CollectionCard, ICollection } from '@/components/CollectionsCard';
import { useAntChain } from '@/hooks/useAntChain';
import { message } from 'antd';

const MintPage: React.FC<unknown> = () => {
  const { contract, isConnected } = useAntChain();

  React.useEffect(() => {
    if (!isConnected) history.replace('/');
  }, [isConnected]);

  const { loading, data: collections } = useRequest(
    async () => {
      const { returnValue } = await contract!.call<string>({
        methodName: 'getOwnedCollections',
      });
      return { data: JSON.parse(returnValue) as ICollection[] };
    },
    {
      ready: !!contract,
      onError: (err) => message.error(err.message),
    },
  );

  return (
    <Space direction="vertical" style={{ maxWidth: 1000, padding: '40px 0' }}>
      <Divider>我铸造的 CryptoFish</Divider>
      {loading && !collections?.length ? <Skeleton paragraph={{ rows: 4 }} style={{ width: 800 }} /> : null}
      <Row gutter={[16, 20]}>
        {collections?.map((collection) => (
          <Col className="gutter-row" span={6} key={collection.attribute}>
            <CollectionCard collection={collection} />
          </Col>
        ))}
      </Row>
    </Space>
  );
};

export default MintPage;
