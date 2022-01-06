export enum Attribute {
  Skin = 'skin',
  Frame = 'frame',
  Background = 'background',
  Fin = 'fin',
  Eye = 'eye',
  Tail = 'tail',
}

export const attributesRange: Record<Attribute, string> = {
  [Attribute.Skin]: '0123456789',
  [Attribute.Frame]: '0123456789ab',
  [Attribute.Background]: '0123456789ab',
  [Attribute.Fin]: '0123456789',
  [Attribute.Eye]: '0123456789',
  [Attribute.Tail]: '0123456789',
};

export const attributeRank: Attribute[] = [
  Attribute.Background,
  Attribute.Frame,
  Attribute.Fin,
  Attribute.Tail,
  Attribute.Skin,
  Attribute.Eye,
];

export const string2Attribute = (attr: string): Record<Attribute, string> => {
  const [skin, background, frame, fin, eye, tail] = attr.split('');
  return {
    skin,
    background,
    frame,
    fin,
    eye,
    tail,
  };
};

export const getRandomAttribute = () => {
  const attribute = {} as Record<Attribute, string>;
  attributeRank.forEach((a) => {
    const index = Math.floor(Math.random() * attributesRange[a].length);
    attribute[a] = attributesRange[a].split('')[index];
  });
  return attribute;
};

// generated
export const cache: Record<string, Promise<{ default: string }>> = {
  background_0: import('@/assets/background_0.svg'),
  background_1: import('@/assets/background_1.svg'),
  background_2: import('@/assets/background_2.svg'),
  background_3: import('@/assets/background_3.svg'),
  background_4: import('@/assets/background_4.svg'),
  background_5: import('@/assets/background_5.svg'),
  background_6: import('@/assets/background_6.svg'),
  background_7: import('@/assets/background_7.svg'),
  background_8: import('@/assets/background_8.svg'),
  background_9: import('@/assets/background_9.svg'),
  background_a: import('@/assets/background_a.svg'),
  background_b: import('@/assets/background_b.svg'),
  eye_0: import('@/assets/eye_0.svg'),
  eye_1: import('@/assets/eye_1.svg'),
  eye_2: import('@/assets/eye_2.svg'),
  eye_3: import('@/assets/eye_3.svg'),
  eye_4: import('@/assets/eye_4.svg'),
  eye_5: import('@/assets/eye_5.svg'),
  eye_6: import('@/assets/eye_6.svg'),
  eye_7: import('@/assets/eye_7.svg'),
  eye_8: import('@/assets/eye_8.svg'),
  eye_9: import('@/assets/eye_9.svg'),
  fin_0: import('@/assets/fin_0.svg'),
  fin_1: import('@/assets/fin_1.svg'),
  fin_2: import('@/assets/fin_2.svg'),
  fin_3: import('@/assets/fin_3.svg'),
  fin_4: import('@/assets/fin_4.svg'),
  fin_5: import('@/assets/fin_5.svg'),
  fin_6: import('@/assets/fin_6.svg'),
  fin_7: import('@/assets/fin_7.svg'),
  fin_8: import('@/assets/fin_8.svg'),
  fin_9: import('@/assets/fin_9.svg'),
  frame_0: import('@/assets/frame_0.svg'),
  frame_1: import('@/assets/frame_1.svg'),
  frame_2: import('@/assets/frame_2.svg'),
  frame_3: import('@/assets/frame_3.svg'),
  frame_4: import('@/assets/frame_4.svg'),
  frame_5: import('@/assets/frame_5.svg'),
  frame_6: import('@/assets/frame_6.svg'),
  frame_7: import('@/assets/frame_7.svg'),
  frame_8: import('@/assets/frame_8.svg'),
  frame_9: import('@/assets/frame_9.svg'),
  frame_a: import('@/assets/frame_a.svg'),
  frame_b: import('@/assets/frame_b.svg'),
  skin_0: import('@/assets/skin_0.svg'),
  skin_1: import('@/assets/skin_1.svg'),
  skin_2: import('@/assets/skin_2.svg'),
  skin_3: import('@/assets/skin_3.svg'),
  skin_4: import('@/assets/skin_4.svg'),
  skin_5: import('@/assets/skin_5.svg'),
  skin_6: import('@/assets/skin_6.svg'),
  skin_7: import('@/assets/skin_7.svg'),
  skin_8: import('@/assets/skin_8.svg'),
  skin_9: import('@/assets/skin_9.svg'),
  tail_0: import('@/assets/tail_0.svg'),
  tail_1: import('@/assets/tail_1.svg'),
  tail_2: import('@/assets/tail_2.svg'),
  tail_3: import('@/assets/tail_3.svg'),
  tail_4: import('@/assets/tail_4.svg'),
  tail_5: import('@/assets/tail_5.svg'),
  tail_6: import('@/assets/tail_6.svg'),
  tail_7: import('@/assets/tail_7.svg'),
  tail_8: import('@/assets/tail_8.svg'),
  tail_9: import('@/assets/tail_9.svg'),
};
