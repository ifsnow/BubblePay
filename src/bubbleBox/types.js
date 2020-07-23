// @flow

import { Animated } from 'react-native';

export const BUBBLE_BOX_EFFECT_HEIGHT = 50;

export const BUBBLE_BOX_MODE = {
  NORMAL: 'NORMAL',
  HIDDEN: 'HIDDEN',
  FULL: 'FULL',
};

export type BubbleBoxModeType = $Values<typeof BUBBLE_BOX_MODE>;

export type BubbleBoxContextType = {
  windowWidth: number,
  windowHeight: number,
  summaryHeight: number,
  boxModes: BubbleBoxModeType[],
  setAllBoxsMode: (boxMoe: BubbleBoxModeType) => void,
  isBoxFull: boolean,
  setBoxFull: (isBoxFull: boolean) => void,
  currentCardId: number,
  setCurrentCardId: (currentCardId: number) => void,
  isProcessing: boolean,
  setProcessing: (isProcessing: boolean) => void,
};

export const BUBBLE_BOX_EFFECT = {
  UP_TO_FLAT: 'UP_TO_FLAT',
  FLAT_TO_UP: 'FLAT_TO_UP',
  FLAT_TO_DOWN: 'FLAT_TO_DOWN',
  DOWN_TO_FLAT: 'DOWN_TO_FLAT',
};

export type BubbleBoxEffectType = $Values<typeof BUBBLE_BOX_EFFECT>;

export type BubbleBoxAnimationsType = {
  show: Animated.Value;
  effect: Animated.Value;
  summary: Animated.Value;
  full: Animated.Value;
};
