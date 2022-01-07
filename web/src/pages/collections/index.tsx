import * as React from 'react';
import { Row, Col, Divider, Button, Space, Skeleton } from 'antd';
import { history, useRequest } from 'umi';
import { CollectionCard, ICollection } from '@/components/CollectionsCard';
import { useAntChain } from '@/hooks/useAntChain';
import { message } from 'antd';

const limit = 10;

const PuzzlePage: React.FC<unknown> = () => {
  const { contract, isConnected } = useAntChain();
  const [collections, setCollections] = React.useState<ICollection[]>([]);

  React.useEffect(() => {
    if (!isConnected) history.replace('/');
  }, [isConnected]);

  const { loading, run: getCollections } = useRequest(
    async (limit?: number, skip?: number) => {
      const { returnValue } = await contract!.call<string>({
        methodName: 'getCollections',
        args: [limit ?? 20, skip ?? 0],
      });
      return { data: JSON.parse(returnValue) as ICollection[] };
    },
    {
      ready: !!contract,
      manual: true,
      onError: (err) => message.error(err.message),
    },
  );
  React.useEffect(() => {
    async function getCollectionsInitData() {
      if (contract) {
        const list = await getCollections(limit, 0);
        if (list.length) {
          setCollections(list);
        } else {
          message.info('我也是有底线的~');
        }
      }
    }
    getCollectionsInitData();
  }, [!!contract]);

  return (
    <Space direction="vertical" style={{ maxWidth: 1000, padding: '40px 0' }}>
      {loading && !collections.length ? <Skeleton paragraph={{ rows: 4 }} style={{ width: 800 }} /> : null}
      <Row gutter={[16, 20]}>
        {collections?.map((collection) => (
          <Col className="gutter-row" span={6} key={collection.attribute}>
            <CollectionCard collection={collection} />
          </Col>
        ))}
      </Row>
      <Divider>
        <Button
          type="link"
          loading={loading}
          onClick={async () => {
            const list = await getCollections(limit, collections.length);
            if (list.length) {
              setCollections((c) => [...c, ...list]);
            } else {
              message.info('我也是有底线的~');
            }
          }}
        >
          加载更多
        </Button>
      </Divider>
    </Space>
  );
};

export default PuzzlePage;
