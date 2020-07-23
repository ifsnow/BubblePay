// @flow

import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Animated,
  Easing,
} from 'react-native';

import {
  type BubbleBoxAnimationsType,
  BUBBLE_BOX_MODE,
  type BubbleBoxModeType,
  BUBBLE_BOX_EFFECT,
  type BubbleBoxEffectType,
} from './types';

type ParamsType = {|
  animations: BubbleBoxAnimationsType,
  changeEffectPath: (type: BubbleBoxEffectType, value: number, updatePath?: boolean) => void,
  index: number,
|};

export default function useBubbleBoxAnimationActions({
  animations,
  changeEffectPath,
  index,
}: ParamsType) {
  const [currentMode, setCurrentMode] = useState<BubbleBoxModeType>(BUBBLE_BOX_MODE.NORMAL);
  const [currentEffectType, setCurrentEffectType] = useState<BubbleBoxEffectType>(BUBBLE_BOX_EFFECT.UP_TO_FLAT);

  const actions = useMemo(() => ({}), []);

  actions.currentMode = currentMode;
  actions.currentEffectType = currentEffectType;

  // ==========================================================================
  // show: BUBBLE_BOX_EFFECT.UP_TO_FLAT
  //       => BUBBLE_BOX_EFFECT.FLAT_TO_DOWN
  //       => BUBBLE_BOX_EFFECT.DOWN_TO_FLAT
  // ==========================================================================
  actions.show = useCallback(() => {
    animations.show.setValue(0);
    animations.effect.setValue(0);

    setCurrentEffectType(BUBBLE_BOX_EFFECT.UP_TO_FLAT);

    let transitionType = BUBBLE_BOX_EFFECT.UP_TO_FLAT;
    changeEffectPath(transitionType, 0, false);

    animations.effect.addListener(({ value }) => {
      if (transitionType === BUBBLE_BOX_EFFECT.UP_TO_FLAT && value > 1) {
        transitionType = BUBBLE_BOX_EFFECT.FLAT_TO_DOWN;
        setCurrentEffectType(BUBBLE_BOX_EFFECT.FLAT_TO_DOWN);
      } else if (transitionType === BUBBLE_BOX_EFFECT.FLAT_TO_DOWN && value > 2) {
        transitionType = BUBBLE_BOX_EFFECT.DOWN_TO_FLAT;
      }

      let pathValue = value;
      if (transitionType === BUBBLE_BOX_EFFECT.FLAT_TO_DOWN) {
        pathValue -= 1.0;
      } else if (transitionType === BUBBLE_BOX_EFFECT.DOWN_TO_FLAT) {
        pathValue -= 2.0;
      }

      changeEffectPath(transitionType, pathValue);
    });

    Animated.parallel([
      Animated.spring(animations.show, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(animations.effect, {
        toValue: 3,
        duration: 1350,
        delay: 350,
        easing: Easing.bezier(0.175, 0.885, 0.320, 1),
        useNativeDriver: true,
      }),
      Animated.timing(animations.summary, {
        toValue: 1,
        duration: 300,
        delay: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animations.effect.removeAllListeners();
      setCurrentMode(BUBBLE_BOX_MODE.NORMAL);
    });
  }, [animations, changeEffectPath]);

  // ==========================================================================
  // hide
  // ==========================================================================
  actions.hide = useCallback(() => {
    animations.effect.addListener(({ value }) => {
      changeEffectPath(BUBBLE_BOX_EFFECT.FLAT_TO_DOWN, value);
    });

    animations.effect.setValue(0);

    Animated.parallel([
      Animated.timing(animations.show, {
        toValue: 0,
        duration: 450,
        delay: 250,
        useNativeDriver: true,
      }),
      Animated.timing(animations.effect, {
        toValue: 1,
        duration: 550,
        easing: Easing.bezier(0.175, 0.885, 0.320, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      animations.effect.removeAllListeners();
      setCurrentMode(BUBBLE_BOX_MODE.HIDDEN);
    });
  }, [animations, changeEffectPath]);

  // ==========================================================================
  // full
  // ==========================================================================
  actions.full = useCallback((onEnd: () => mixed) => {
    setCurrentEffectType(BUBBLE_BOX_EFFECT.UP_TO_FLAT);

    animations.effect.addListener(({ value }) => {
      changeEffectPath(BUBBLE_BOX_EFFECT.FLAT_TO_UP, value);
    });

    animations.effect.setValue(0);

    Animated.parallel([
      Animated.timing(animations.show, {
        toValue: 2,
        duration: 450 - (index * 150),
        delay: 850,
        useNativeDriver: true,
      }),
      Animated.timing(animations.effect, {
        toValue: 1,
        duration: 550,
        delay: 300,
        easing: Easing.bezier(0.175, 0.885, 0.320, 1),
        useNativeDriver: true,
      }),
      Animated.timing(animations.summary, {
        toValue: 0.5,
        duration: 500,
        delay: 950,
        useNativeDriver: true,
      }),
      Animated.timing(animations.full, {
        toValue: 2,
        duration: 650 - (index * 150),
        delay: 950,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animations.effect.removeAllListeners();
      setCurrentMode(BUBBLE_BOX_MODE.FULL);
      onEnd();
    });
  }, [animations, changeEffectPath, index]);

  // ==========================================================================
  // fullToNormal
  // ==========================================================================
  actions.fullToNormal = useCallback((onEnd: () => mixed) => {
    setCurrentEffectType(BUBBLE_BOX_EFFECT.FLAT_TO_DOWN);

    animations.effect.addListener(({ value }) => {
      changeEffectPath(BUBBLE_BOX_EFFECT.DOWN_TO_FLAT, value);
    });

    animations.effect.setValue(0);

    Animated.parallel([
      Animated.timing(animations.show, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(animations.effect, {
        toValue: 1,
        duration: 550,
        delay: 450,
        easing: Easing.bezier(0.175, 0.885, 0.320, 1),
        useNativeDriver: true,
      }),
      Animated.timing(animations.summary, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(animations.full, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animations.effect.removeAllListeners();
      setCurrentMode(BUBBLE_BOX_MODE.NORMAL);
      onEnd();
    });
  }, [animations, changeEffectPath]);

  // ==========================================================================
  // hiddenToNormal
  // ==========================================================================
  actions.hiddenToNormal = useCallback(() => {
    setCurrentEffectType(BUBBLE_BOX_EFFECT.UP_TO_FLAT);

    animations.effect.addListener(({ value }) => {
      changeEffectPath(BUBBLE_BOX_EFFECT.UP_TO_FLAT, value);
    });

    animations.effect.setValue(0);

    Animated.parallel([
      Animated.timing(animations.show, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(animations.effect, {
        toValue: 1,
        duration: 450,
        delay: 350,
        easing: Easing.bezier(0.175, 0.885, 0.320, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      animations.effect.removeAllListeners();
      setCurrentEffectType(BUBBLE_BOX_EFFECT.FLAT_TO_DOWN);
      setCurrentMode(BUBBLE_BOX_MODE.NORMAL);
    });
  }, [animations, changeEffectPath]);

  return actions;
}
