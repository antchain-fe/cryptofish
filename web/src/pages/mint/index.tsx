import * as React from 'react';
import { Row, Col, Divider, Button, Space, Skeleton } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { history, useRequest } from 'umi';
import confetti from 'canvas-confetti';
import { CollectionCard, ICollection } from '@/components/CollectionsCard';
import { useAntChain } from '@/hooks/useAntChain';
import { message } from 'antd';

const MintPage: React.FC<unknown> = () => {
  const { contract, isConnected } = useAntChain();
  const [collections, setCollections] = React.useState<ICollection[]>([]);

  React.useEffect(() => {
    if (!isConnected) history.replace('/');
  }, [isConnected]);

  const { loading: mintLoading, run: mint } = useRequest(
    async () => {
      const { returnValue } = await contract!.call<string>({
        methodName: 'mint',
      });
      return { data: JSON.parse(returnValue) as ICollection | null };
    },
    {
      manual: true,
      onError: (err) => message.error(err.message),
    },
  );
  const { loading } = useRequest(
    async () => {
      const { returnValue } = await contract!.call<string>({
        methodName: 'getOwnedCollections',
      });
      return { data: JSON.parse(returnValue) as ICollection[] };
    },
    {
      ready: !!contract,
      onSuccess: (c) => {
        setCollections(c);
      },
      onError: (err) => message.error(err.message),
    },
  );

  return (
    <Space direction="vertical" style={{ width: 900, padding: '40px 0' }}>
      <Button
        loading={mintLoading}
        type="primary"
        size="large"
        shape="round"
        icon={<ThunderboltOutlined />}
        onClick={async () => {
          const newCollection = await mint();
          if (newCollection) {
            setCollections([...collections, newCollection]);
            confetti();
            message.success('铸造成功');
          } else {
            message.error('铸造失败');
          }
        }}
      >
        铸造
      </Button>
      <Divider>我铸造的 CryptoFish</Divider>
      {loading && !collections?.length ? <Skeleton paragraph={{ rows: 4 }} style={{ width: 800 }} /> : null}
      <Row gutter={[16, 20]}>
        {collections?.map((collection) => (
          <Col className="gutter-row" span={6} key={collection.attribute}>
            <CollectionCard collection={collection} />
          </Col>
        ))}
        {!loading && collections?.length === 0 ? '还未铸造过 CryptoFish，点击上方按钮铸造，每个账户限量 20 个。' : null}
      </Row>
    </Space>
  );
};

export default MintPage;
