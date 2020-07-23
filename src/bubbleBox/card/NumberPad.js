// @flow
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
} from 'react-native';

import NumberPadButton from './NumberPadButton';
import NumberPadIndicator from './NumberPadIndicator';

import {
  normalizeSizeWithWidth,
  normalizeSizeWithHeight,
} from './utils';

import {
  BUTTON_CONTAINER_WIDTH,
  BUTTON_WIDTH,
  BUTTON_HEIGHT,
  BUTTON_PADDING_HORIZONTAL,
  BUTTON_PADDING_VERTICAL,
  BUTTON_CIRCLE_SIZE,
  BUTTON_CIRCLE_HALF_SIZE,
  INDICATOR_MAX_COUNT,
  INDICATOR_WIDTH,
  INDICATOR_HEIGHT,
  INDICATOR_POSTION_LEFT_BASE,
  INDICATOR_POSTION_TOP_BASE,
  INDICATOR_ANIMATION_SCALE,
} from './constancts';

type Props = {|
  isEnabled: boolean,
  indicatorActiveColor: string,
  onChange: (payCode: string) => void,
  onComplete: () => void,
|};

const NumberPad = ({
  isEnabled,
  indicatorActiveColor,
  onChange,
  onComplete,
}: Props) => {
  const payCodes = useMemo(() => [], []);
  const [indicatorActiveCount, setIndicatorActiveCurrent] = useState(0);
  const [position, setPosition] = useState({
    row: 0,
    col: 0,
  });

  const moveAnimation = useMemo(() => new Animated.Value(0), []);

  const moveAnimationStyle = useMemo(() => {
    const left = (BUTTON_WIDTH * position.col) + BUTTON_PADDING_HORIZONTAL;
    const top = (BUTTON_HEIGHT * position.row) + BUTTON_PADDING_VERTICAL + INDICATOR_HEIGHT;

    const nextIndicator = payCodes.length - 1;
    const indicatorLeft = INDICATOR_POSTION_LEFT_BASE + (nextIndicator * INDICATOR_WIDTH) - left;
    const indicatorTop = INDICATOR_POSTION_TOP_BASE - top;

    const moveAnimationStyle = {
      position: 'absolute',
      left,
      top,
      width: BUTTON_CIRCLE_SIZE,
      height: BUTTON_CIRCLE_SIZE,
      borderRadius: BUTTON_CIRCLE_HALF_SIZE,
      backgroundColor: indicatorActiveColor,
      transform: [
        {
          translateX: moveAnimation.interpolate({
            inputRange: [0, 1, 2],
            outputRange: ([0, 0, indicatorLeft]: number[]),
          }),
        },
        {
          translateY: moveAnimation.interpolate({
            inputRange: [0, 1, 2],
            outputRange: ([0, 0, indicatorTop]: number[]),
          }),
        },
        {
          scale: moveAnimation.interpolate({
            inputRange: [0, 1, 2],
            outputRange: ([0, 1, INDICATOR_ANIMATION_SCALE]: number[]),
          }),
        },
      ],
    };

    return moveAnimationStyle;
  }, [payCodes.length, moveAnimation, position, indicatorActiveColor]);

  const onPressButton = useCallback((value: number | string, row: number, col: number) => {
    if (payCodes.length >= INDICATOR_MAX_COUNT) {
      return;
    }

    setPosition({
      row,
      col,
    });

    payCodes.push(value);

    moveAnimation.setValue(1);
    Animated.spring(moveAnimation, {
      toValue: 2,
      useNativeDriver: true,
      overshootClamping: true,
    }).start(() => {
      moveAnimation.setValue(0);
      setIndicatorActiveCurrent(payCodes.length);
      onChange(payCodes.join(''));

      if (payCodes.length >= INDICATOR_MAX_COUNT) {
        onComplete();
      }
    });
  }, [payCodes, moveAnimation, onChange, onComplete]);

  const onPressBack = useCallback(() => {
    payCodes.pop();
    setIndicatorActiveCurrent(payCodes.length);
  }, [payCodes]);

  // initialize
  useEffect(() => {
    if (!isEnabled) {
      payCodes.length = 0;
      setIndicatorActiveCurrent(0);
    }
  }, [isEnabled, payCodes]);

  if (!isEnabled) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.codeText}>Enter Pay Code</Text>
      <View style={styles.buttons}>
        <NumberPadIndicator
          activeColor={indicatorActiveColor}
          activeCount={indicatorActiveCount}
        />
        <View style={styles.row}>
          <NumberPadButton value={1} delay={100} row={0} col={0} onPress={onPressButton} />
          <NumberPadButton value={2} delay={200} row={0} col={1} onPress={onPressButton} />
          <NumberPadButton value={3} delay={300} row={0} col={2} onPress={onPressButton} />
        </View>

        <View style={styles.row}>
          <NumberPadButton value={4} delay={300} row={1} col={0} onPress={onPressButton} />
          <NumberPadButton value={5} delay={100} row={1} col={1} onPress={onPressButton} />
          <NumberPadButton value={6} delay={200} row={1} col={2} onPress={onPressButton} />
        </View>

        <View style={styles.row}>
          <NumberPadButton value={7} delay={100} row={2} col={0} onPress={onPressButton} />
          <NumberPadButton value={8} delay={200} row={2} col={1} onPress={onPressButton} />
          <NumberPadButton value={9} delay={300} row={2} col={2} onPress={onPressButton} />
        </View>

        <View style={styles.row}>
          <View style={styles.dummyButton} />
          <NumberPadButton value={0} delay={200} row={3} col={1} onPress={onPressButton} />
          <NumberPadButton value="<" delay={300} row={3} col={2} onPress={onPressBack} />
        </View>

        <Animated.View style={moveAnimationStyle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: normalizeSizeWithHeight(40),
  },
  buttons: {
    width: BUTTON_CONTAINER_WIDTH,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  codeText: {
    fontSize: normalizeSizeWithWidth(20),
    fontWeight: 'bold',
    color: '#222',
  },
  dummyButton: {
    flex: 1,
  },
});

export default React.memo<Props>(NumberPad);
