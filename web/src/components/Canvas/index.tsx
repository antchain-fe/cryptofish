import * as React from 'react';
import { attributeRank, attributesRange, cache } from '@/common/attribute';
import type { ICanvasProps, ICanvasRef } from './ICanvas';

export * from './ICanvas';

const imgCache: Map<string, Promise<HTMLImageElement>> = new Map();
// const ratio = 10; //devicePixelRatio || 1; // 获取设备的像素比
const [w, h] = [34, 34]; // base width/height

// name: {attr}_{value}
async function loadAsset(name: string): Promise<HTMLImageElement> {
  if (imgCache.has(name)) return imgCache.get(name)!;
  const url = (await cache?.[name]).default;
  const p: Promise<HTMLImageElement> = new Promise((resolve) => {
    const image = new Image();
    image.addEventListener('load', () => {
      imgCache.set(name, p);
      resolve(image);
    });
    image.src = url;
    image.crossOrigin = 'anonymous';
    // TODO: onError
  });
  return p;
}

export const Canvas = React.forwardRef<ICanvasRef, ICanvasProps>(({ attribute, ratio = 1, style, className }, ref) => {
  // console.log(attribute);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [width, height] = React.useMemo(() => [w * ratio, h * ratio], [ratio]);

  React.useEffect(() => {
    const render = async () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, width, height); // 清空画布
        ctx?.setTransform(ratio, 0, 0, ratio, 0, 0); // 根据像素比转换

        // 这里需要保证图层绘制的顺序
        const imgs = await Promise.all(
          attributeRank.map(async (attr) => {
            const attrValue = attribute?.[attr];
            if (!attrValue || !attributesRange[attr].includes(attrValue)) {
              console.warn('attribute error:', attribute);
              return;
            }
            return loadAsset(`${attr}_${attrValue}`);
          }),
        );
        imgs.forEach((i) => {
          if (i) ctx?.drawImage(i, 0, 0);
        });
      }
    };
    render();
  }, [attribute, width, height, ratio]);

  React.useImperativeHandle(
    ref,
    () => ({
      toDataURL: (type = 'image/png', quality = 1.0) => canvasRef.current?.toDataURL(type, quality),
    }),
    [],
  );

  return (
    <canvas ref={canvasRef} className={className} width={width} height={height} style={{ ...style, width, height }} />
  );
});
Canvas.displayName = 'Canvas';
