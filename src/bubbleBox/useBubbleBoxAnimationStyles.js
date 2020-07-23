// @flow

import {
  useMemo,
  useContext,
} from 'react';

import BubbleBoxContext from './BubbleBoxContext';

import {
  BUBBLE_BOX_EFFECT_HEIGHT,
  type BubbleBoxAnimationsType,
} from './types';

type ParamsType = {|
  animations: BubbleBoxAnimationsType,
  index: number,
  backgroundColor: string,
|};

export default function useBubbleBoxAnimationStyles({
  animations,
  index,
  backgroundColor,
}: ParamsType) {
  const {
    windowHeight,
    summaryHeight,
  } = useContext(BubbleBoxContext);

  return useMemo(() => {
    const containerTanslateOutputRange: number[] = [
      windowHeight,
      windowHeight - (summaryHeight * (index + 1)),
      -BUBBLE_BOX_EFFECT_HEIGHT,
    ];

    const container = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 10 - index,
      justifyContent: 'flex-end',
      transform: [
        {
          translateY: animations.show.interpolate({
            inputRange: [0, 1, 2],
            outputRange: containerTanslateOutputRange,
          }),
        },
      ],
      opacity: animations.show.interpolate({
        inputRange: [0, 1],
        outputRange: ([0, 1]: number[]),
      }),
    };

    const contentWrapper = {
      backgroundColor,
      height: windowHeight + BUBBLE_BOX_EFFECT_HEIGHT,
    };

    const content = {
      flex: 1,
    };

    const contentSummary = {
      justifyContent: 'center',
      alignItems: 'center',
      height: summaryHeight,
      transform: [
        {
          translateY: animations.summary.interpolate({
            inputRange: [0, 1],
            outputRange: ([500 - (index * 100), 0]: number[]),
            extrapolate: 'clamp',
          }),
        },
        {
          rotate: animations.effect.interpolate({
            inputRange: [2, 2.3, 2.7, 3],
            outputRange: (['0deg', '-10deg', '5deg', '0deg']: string[]),
            extrapolate: 'clamp',
          }),
        },
      ],
      opacity: animations.full.interpolate({
        inputRange: [0, 0.3],
        outputRange: ([1, 0]: number[]),
        extrapolate: 'clamp',
      }),
    };

    const contentFull = {
      position: 'absolute',
      left: 0,
      top: -BUBBLE_BOX_EFFECT_HEIGHT,
      right: 0,
      bottom: 0,
      transform: [
        {
          scale: animations.full.interpolate({
            inputRange: [1, 1.5, 2],
            outputRange: ([1, 1.1, 1]: number[]),
            extrapolate: 'clamp',
          }),
        },
        {
          translateY: animations.full.interpolate({
            inputRange: [0, 0.01],
            outputRange: ([2000, 0]: number[]),
            extrapolate: 'clamp',
          }),
        },
      ],
      opacity: animations.full.interpolate({
        inputRange: [0, 0.5],
        outputRange: ([0, 1]: number[]),
        extrapolate: 'clamp',
      }),
    };

    return {
      container,
      contentWrapper,
      content,
      contentSummary,
      contentFull,
    };
  }, [animations, windowHeight, summaryHeight, backgroundColor, index]);
}
