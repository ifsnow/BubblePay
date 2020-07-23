// @flow

import React, {
  useMemo,
  useEffect,
  useContext,
} from 'react';

import {
  Animated,
  View,
  StyleSheet,
} from 'react-native';

import BubbleBoxContext from './BubbleBoxContext';
import useBubbleBoxEffect from './useBubbleBoxEffect';
import useBubbleBoxAnimationStyles from './useBubbleBoxAnimationStyles';
import useBubbleBoxAnimationActions from './useBubbleBoxAnimationActions';
import BubbleBoxEffect from './BubbleBoxEffect';

import {
  BUBBLE_BOX_EFFECT_HEIGHT,
  BUBBLE_BOX_MODE,
  type BubbleBoxAnimationsType,
} from './types';

type Props = {|
  cardId: any,
  index: number,
  backgroundColor: string,
  adjacentBackgroundColor: string,
  children: React$Node[],
|};

const BubbleBox = ({
  cardId,
  backgroundColor,
  adjacentBackgroundColor,
  index,
  children,
}: Props) => {
  const {
    boxModes,
    setBoxFull,
    setCurrentCardId,
  } = useContext(BubbleBoxContext);

  const boxMode = boxModes[index];

  const {
    effectPath,
    changeEffectPath,
  } = useBubbleBoxEffect();

  const animations = useMemo<BubbleBoxAnimationsType>(() => ({
    show: new Animated.Value(0),
    effect: new Animated.Value(0),
    summary: new Animated.Value(0),
    full: new Animated.Value(0),
  }), []);

  const animationStyles = useBubbleBoxAnimationStyles({
    animations,
    index,
    backgroundColor,
  });

  const animationActions = useBubbleBoxAnimationActions({
    animations,
    changeEffectPath,
    index,
  });

  // Initial animation showing all cards
  useEffect(() => {
    let timeoutId = setTimeout(() => {
      timeoutId = null;
      animationActions.show();
    }, index * 250);

    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [animationActions, index]);

  // Animation when the card mode changes
  useEffect(() => {
    const { currentMode } = animationActions;

    // Mode changed from `HIDDEN` to `NORMAL`
    if (boxMode === BUBBLE_BOX_MODE.HIDDEN && currentMode === BUBBLE_BOX_MODE.NORMAL) {
      animationActions.hide();
      return;
    }

    // Mode changed from `FULL` to `NORMAL`
    if (boxMode === BUBBLE_BOX_MODE.FULL && currentMode === BUBBLE_BOX_MODE.NORMAL) {
      animationActions.full(() => {
        setBoxFull(true);
        setCurrentCardId(cardId);
      });
      return;
    }

    // Mode changed from `NORMAL` to `FULL` or `HIDDEN`
    if (boxMode === BUBBLE_BOX_MODE.NORMAL) {
      if (currentMode === BUBBLE_BOX_MODE.FULL) {
        animationActions.fullToNormal(() => {
          setBoxFull(false);
          setCurrentCardId(0);
        });
      } else if (currentMode === BUBBLE_BOX_MODE.HIDDEN) {
        animationActions.hiddenToNormal();
      }
    }
  }, [boxMode, animationActions, setBoxFull, setCurrentCardId, cardId]);

  const [CardSummary, CardFull] = children;
  if (!CardSummary || !CardFull) {
    return null;
  }

  return (
    <Animated.View style={animationStyles.container}>
      <View style={styles.inner}>
        <BubbleBoxEffect
          effectType={animationActions.currentEffectType}
          effectPath={effectPath}
          backgroundColor={backgroundColor}
          adjacentBackgroundColor={adjacentBackgroundColor}
        />
        <View style={animationStyles.contentWrapper}>
          <View style={animationStyles.content}>
            <Animated.View style={animationStyles.contentSummary}>
              {CardSummary}
            </Animated.View>
            <Animated.View style={animationStyles.contentFull}>
              {CardFull}
            </Animated.View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginBottom: -BUBBLE_BOX_EFFECT_HEIGHT,
  },
});

export default React.memo<Props>(BubbleBox);
