// @flow

import React, {
  useMemo,
  useContext,
} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import {
  Surface,
  Shape,
} from '@react-native-community/art';

import BubbleBoxContext from './BubbleBoxContext';

import {
  BUBBLE_BOX_EFFECT_HEIGHT,
  BUBBLE_BOX_EFFECT,
  type BubbleBoxEffectType,
} from './types';

type Props = {|
  effectType: BubbleBoxEffectType,
  effectPath: any,
  backgroundColor: string,
  adjacentBackgroundColor: string,
|};

const BubbleBoxEffect = ({
  effectType,
  effectPath,
  backgroundColor,
  adjacentBackgroundColor,
}: Props) => {
  const { windowWidth } = useContext(BubbleBoxContext);

  const {
    shapeFillColor,
    containerStyle,
  } = useMemo(() => ({
    shapeFillColor: effectType === BUBBLE_BOX_EFFECT.UP_TO_FLAT
      ? backgroundColor
      : adjacentBackgroundColor,
    containerStyle:  [
      styles.container,
      effectType === BUBBLE_BOX_EFFECT.FLAT_TO_DOWN && styles.effectIsDown,
    ],
  }), [effectType, backgroundColor, adjacentBackgroundColor]);

  return (
    <View style={containerStyle}>
      <Surface width={windowWidth} height={BUBBLE_BOX_EFFECT_HEIGHT}>
        <Shape fill={shapeFillColor} d={effectPath} />
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: -1,
  },
  effectIsDown: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -1,
    zIndex: 2,
  },
});

export default BubbleBoxEffect;
