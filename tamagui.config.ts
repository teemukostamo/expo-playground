import { createMedia } from '@tamagui/react-native-media-driver';
import { config } from '@tamagui/config/v2-reanimated';
import { createTamagui, createFont } from 'tamagui';
import { themes } from '@tamagui/themes';

const regular = createFont({
  family: 'regular',
  // keys used for the objects you pass to `size`, `lineHeight`, `weight`
  // and `letterSpacing` should be consistent. The `createFont` function
  // will fill-in any missing values if `lineHeight`, `weight` or `letterSpacing`
  // are subsets of `size`
  size: {
    1: 12,
    2: 14,
    3: 15,
    4: 16,
  },
  lineHeight: {
    // 1 will be 22
    2: 22,
  },
  weight: {
    1: '300',
    // 2 will be 300
    3: '600',
  },
  letterSpacing: {
    1: 0,
    2: -1,
    // 3 will be -1
  },
  // (native) swap out fonts by face/style
  face: {
    300: { normal: 'regular' },
    600: { normal: 'regular' },
  },
});
const title = createFont({
  family: 'title',
  // keys used for the objects you pass to `size`, `lineHeight`, `weight`
  // and `letterSpacing` should be consistent. The `createFont` function
  // will fill-in any missing values if `lineHeight`, `weight` or `letterSpacing`
  // are subsets of `size`
  size: {
    1: 12,
    2: 14,
    3: 15,
    4: 16,
  },
  lineHeight: {
    // 1 will be 22
    2: 22,
  },
  weight: {
    1: '300',
    // 2 will be 300
    3: '600',
  },
  letterSpacing: {
    1: 0,
    2: -1,
    // 3 will be -1
  },
  // (native) swap out fonts by face/style
  face: {
    300: { normal: 'title' },
    600: { normal: 'title' },
  },
});

const tokens = {
  ...config.tokens,
  color: {
    ...config.tokens.color,
    linecutDarkBlue: '#002A46',
    linecutDarkGold: '#D39C2E',
    linecutLightGold: '#E6B83D',
  },
};

const tamaguiConfig = createTamagui({
  ...config,
  fonts: {
    heading: title,
    body: regular,
  },
  tokens,
  themes: {
    dark: {
      ...themes.dark,
      background: tokens.color.linecutDarkBlue,
      bg: tokens.color.linecutDarkBlue,
      color: tokens.color.linecutDarkGold,
      accent: tokens.color.linecutLightGold,
    },
    light: {
      ...themes.light,
      background: '#fff',
      bg: '#fff',
      color: tokens.color.linecutDarkBlue,
      accent: tokens.color.linecutLightGold,
    },
  },
});

type Conf = typeof tamaguiConfig;
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
