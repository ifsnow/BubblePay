// @flow

import React, {
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

import { normalizeSizeWithHeight } from './utils';

import {
  BUTTON_CIRCLE_SIZE,
  BUTTON_CIRCLE_HALF_SIZE,
  BUTTON_HEIGHT,
} from './constancts';

type Props = {|
  value: number | string,
  delay: number,
  row: number,
  col: number,
  onPress: (value: number | string, row: number, col: number) => mixed,
|};

const NumberPadButton = ({
  value,
  delay,
  row,
  col,
  onPress:
  onPressPad,
}: Props) => {
  const {
    buttonAnimation,
    buttonStyle,
  } = useMemo(() => {
    const buttonAnimation = new Animated.Value(0);
    const buttonStyle = {
      ...styles.button,
      transform: [
        {
          scale: buttonAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ([1, 1.2, 1]: number[]),
          }),
        },
        {
          translateY: buttonAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ([0, 4, 0]: number[]),
          }),
        },
      ],
    };

    return {
      buttonAnimation,
      buttonStyle,
    };
  }, []);

  const startbuttonAnimation = useCallback((delay: number) => {
    buttonAnimation.setValue(0);
    Animated.spring(buttonAnimation, {
      toValue: 1,
      useNativeDriver: true,
      delay,
    }).start();
  }, [buttonAnimation]);

  const onPress = useCallback(() => {
    startbuttonAnimation(0);
    onPressPad(value, row, col);
  }, [startbuttonAnimation, onPressPad, value, row, col]);

  useEffect(() => {
    startbuttonAnimation(delay);
  }, [startbuttonAnimation, delay]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Animated.View style={buttonStyle}>
          <Text style={styles.valueText}>{value}</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: BUTTON_HEIGHT,
  },
  button: {
    width: BUTTON_CIRCLE_SIZE,
    height: BUTTON_CIRCLE_SIZE,
    borderRadius: BUTTON_CIRCLE_HALF_SIZE,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00000014',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 2,
  },
  valueText: {
    fontSize: normalizeSizeWithHeight(24),
    fontWeight: 'bold',
  },
});

export default React.memo<Props>(NumberPadButton);
