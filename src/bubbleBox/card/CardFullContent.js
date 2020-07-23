// @flow

import React, {
  useMemo,
  useEffect,
} from 'react';
import {
  StyleSheet,
  Animated,
} from 'react-native';

import ProgressImage from './ProgressImage';

import {
  normalizeSizeWithWidth,
  normalizeSizeWithHeight,
} from './utils';

type Props = {|
  isBoxFull: boolean,
  isProcessing: boolean,
  imageSource: any,
  payCode: string,
  onEndProcess: () => mixed,
  onPressCard: () => mixed,
|};

const CardFullContent = ({
  isBoxFull,
  isProcessing,
  imageSource,
  payCode,
  onEndProcess,
  onPressCard,
}: Props) => {
  const {
    fullAnimation,
    fullAnimationStyle,
  } = useMemo(() => {
    const animation = new Animated.Value(0);

    return {
      fullAnimation: animation,
      fullAnimationStyle: {
        ...styles.full,
        transform: [
          {
            scale: animation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ([1, 1.05, 1]: number[]),
              extrapolate: 'clamp',
            }),
          },
          {
            rotate: animation.interpolate({
              inputRange: [0, 0.3, 0.7, 1, 1.3, 1.7, 2],
              outputRange: (['0deg', '-5deg', '3deg', '0deg', '-5deg', '3deg', '0deg']: string[]),
              extrapolate: 'clamp',
            }),
          },
          {
            translateY: animation.interpolate({
              inputRange: [1, 2],
              outputRange: ([0, normalizeSizeWithHeight(150)]: number[]),
              extrapolate: 'clamp',
            }),
          },
        ],
      },
    };
  }, []);

  useEffect(() => {
    fullAnimation.setValue(0);

    Animated.timing(fullAnimation, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [payCode, fullAnimation]);

  useEffect(() => {
    if (isProcessing) {
      Animated.timing(fullAnimation, {
        toValue: 2,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [isProcessing, fullAnimation]);

  useEffect(() => () => {
    fullAnimation.setValue(0);
  }, [isBoxFull, fullAnimation]);

  return (
    <Animated.View style={fullAnimationStyle}>
      <ProgressImage
        isEnabled={isProcessing}
        imageSource={imageSource}
        imageStyle={styles.full}
        width={normalizeSizeWithWidth(290)}
        onEnd={onEndProcess}
        onPress={onPressCard}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  full: {
    width: normalizeSizeWithWidth(290),
    height: normalizeSizeWithWidth(183),
  },
});

export default React.memo<Props>(CardFullContent);
