import * as React from 'react';
import { Row, Col, Card, Skeleton, Tooltip } from 'antd';
import { useRequest, useParams, history } from 'umi';
import confetti from 'canvas-confetti';
import { CollectionCard, ICollection } from '@/components/CollectionsCard';
import { LikeTwoTone, LoadingOutlined } from '@ant-design/icons';
import { useAntChain } from '@/hooks/useAntChain';
import { message } from 'antd';
import { Canvas, loadAsset } from '@/components/Canvas';
import { string2Attribute, cache } from '@/common/attribute';
import { formatAddress } from '@/common/utils';

const CollectionDetailPage: React.FC<unknown> = () => {
  const { id } = useParams<{ id: string }>();
  const index = React.useMemo(() => Number(id), [id]);
  const { contract, isConnected } = useAntChain();
  const [favor, setFavor] = React.useState(0);
  const [images, setImages] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!isConnected) history.replace('/');
  }, [isConnected]);

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
      onSuccess: (collection) => {
        if (collection?.score >= 2000) {
          confetti();
        }
        setFavor(collection?.favorCount ?? 0);
      },
      onError: (err) => message.error(err.message),
    },
  );

  const { loading: favorLoading, run: favorByIndex } = useRequest(
    async () => {
      const { returnValue } = await contract!.call<number>({
        methodName: 'favorByIndex',
        args: [index],
      });
      return { data: !!returnValue };
    },
    {
      manual: true,
      onSuccess: (success) => {
        if (success) {
          setFavor((f) => f + 1);
        } else {
          message.info('不能给自己的 cryptofish 点赞哦～');
        }
      },
      onError: (err) => message.error(err.message),
    },
  );

  const attribute = string2Attribute(collection?.attribute);

  React.useEffect(() => {
    if (attribute) {
      Promise.all(
        // @ts-ignore
        ['skin', 'background', 'frame', 'fin', 'eye', 'tail'].map((attr) => cache?.[`${attr}_${attribute[attr]}`]),
      ).then((images) => setImages(images.map(({ default: url }) => url)));
    }
  }, [!!attribute]);

  console.log(111, images);

  if (loading) return <Skeleton avatar paragraph={{ rows: 4 }} style={{ width: 800, padding: '40px 0' }} />;
  if (!loading && !attribute) return <div>error</div>;

  console.log(cache[`skin_${attribute!.skin}`]);
  return (
    <Row gutter={16} style={{ padding: '40px 0', width: 900 }}>
      <Col span={8}>
        <Canvas attribute={attribute!} ratio={8} />
      </Col>
      <Col span={16}>
        <Card title={`CryptoFish #${collection?.index}`}>
          <p>特征值: {collection?.attribute}</p>
          <p>
            铸造者: <Tooltip title={collection?.creator}>{formatAddress(collection!.creator)}</Tooltip>
          </p>
          <p>
            点赞数: {favor} &nbsp;
            {favorLoading ? (
              <LoadingOutlined />
            ) : (
              <LikeTwoTone
                twoToneColor="#eb2f96"
                onClick={async () => {
                  await favorByIndex();
                }}
              />
            )}
          </p>
        </Card>
        <Card title={`Attributes #${collection?.attribute}`} style={{ marginTop: 16 }}>
          {images.map((url) => (
            <Card.Grid
              key={url}
              style={{
                width: `${100 / images.length}%`,
                textAlign: 'center',
              }}
            >
              <img src={url} alt={url} />
            </Card.Grid>
          ))}
        </Card>
      </Col>
    </Row>
  );
};
export default CollectionDetailPage;
