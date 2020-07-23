// @flow
import React, {
  useMemo,
  useEffect,
} from 'react';
import {
  View,
  Animated,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import { HITSLOP_PROGRESS_IMAGE } from './constancts';

type Props = {|
  isEnabled: boolean,
  imageSource: any,
  imageStyle: any,
  width: number,
  onEnd: () => mixed,
  onPress: () => mixed,
|};

const ProgressImage = ({
  isEnabled,
  imageSource,
  imageStyle,
  width,
  onEnd,
  onPress,
}: Props) => {
  const {
    progressAnimation,
    progressFrameStyle,
    progressStyle,
  } = useMemo(() => {
    const progressAnimation = new Animated.Value(0);

    const progressFrameStyle = {
      ...styles.progressFrame,
      width,
    };

    const progressStyle = {
      ...styles.progress,
      transform: [
        {
          translateX: progressAnimation.interpolate({
            inputRange: [0, 1, 2],
            outputRange: ([-width, 0, width - 10]: number[]),
          }),
        },
      ],
      opacity: progressAnimation.interpolate({
        inputRange: [0, 1.99, 2],
        outputRange: ([1, 1, 0]: number[]),
      }),
    };

    return {
      progressAnimation,
      progressFrameStyle,
      progressStyle,
    };
  }, [width]);

  useEffect(() => {
    let startTimeoutID;

    if (isEnabled) {
      startTimeoutID = setTimeout(() => {
        startTimeoutID = null;

        progressAnimation.setValue(1);
        Animated.timing(progressAnimation, {
          toValue: 2,
          duration: 2000,
          useNativeDriver: true,
        }).start(({ finished }) => {
          finished && onEnd();
        });
      }, 500);
    }

    return () => {
      if (startTimeoutID) {
        clearTimeout(startTimeoutID);
        startTimeoutID = null;
      }

      progressAnimation.setValue(0);
    };
  }, [isEnabled, progressAnimation, onEnd]);

  return (
    <TouchableWithoutFeedback onPress={onPress} hitSlop={HITSLOP_PROGRESS_IMAGE}>
      <View>
        <Image source={imageSource} style={imageStyle} />
        <View style={progressFrameStyle}>
          <Animated.View style={progressStyle} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  progressFrame: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
});

export default React.memo<Props>(ProgressImage);
