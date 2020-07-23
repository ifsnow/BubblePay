// @flow

import React, {
  useMemo,
  useEffect,
} from 'react';
import { Animated } from 'react-native';

import {
  INDICATOR_SIZE,
  INDICATOR_HALF_SIZE,
  INDICATOR_MARGIN_HORIZONTAL,
} from './constancts';

type Props = {|
  activeColor: string,
  isActive: boolean,
|};

const NumberPadIndicatorCircle = ({
  activeColor,
  isActive,
}: Props) => {
  const {
    circleAnimation,
    circleStyle,
  } = useMemo(() => {
    const circleAnimation = new Animated.Value(0);
    const circleStyle = {
      width: INDICATOR_SIZE,
      height: INDICATOR_SIZE,
      borderRadius: INDICATOR_HALF_SIZE,
      marginHorizontal: INDICATOR_MARGIN_HORIZONTAL,
      transform: [
        {
          scale: circleAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ([1, 1.5, 1]: number[]),
          }),
        },
      ],
      backgroundColor: '#fff',
    };

    return {
      circleAnimation,
      circleStyle,
    };
  }, []);

  useEffect(() => {
    Animated.spring(circleAnimation, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [circleAnimation, isActive]);

  const style = [circleStyle, isActive && { backgroundColor: activeColor }];
  return <Animated.View style={style} />;
};

export default React.memo<Props>(NumberPadIndicatorCircle);
