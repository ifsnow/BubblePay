// @flow

import { Dimensions } from 'react-native';

const {
  width,
  height,
} = Dimensions.get('window');

const DEVICE_SCALE_WIDTH = width / 414;
const DEVICE_SCALE_HEIGHT = height / 896;

export function normalizeSizeWithWidth(size: number) {
  return Math.round(DEVICE_SCALE_WIDTH * size);
}

export function normalizeSizeWithHeight(size: number) {
  return Math.round(DEVICE_SCALE_HEIGHT * size);
}
