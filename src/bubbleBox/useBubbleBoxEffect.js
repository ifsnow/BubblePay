// @flow

import {
  useMemo,
  useState,
  useCallback,
  useContext,
} from 'react';

import BubbleBoxContext from './BubbleBoxContext';

import {
  BUBBLE_BOX_EFFECT_HEIGHT,
  BUBBLE_BOX_EFFECT,
  type BubbleBoxEffectType,
} from './types';

const SVGPath = require('art/modes/svg/path');
const Morph = require('art/morph/path');

export default function useBubbleBoxEffect() {
  const { windowWidth } = useContext(BubbleBoxContext);

  const {
    initialPath,
    effectTransitions,
  } = useMemo(() => {
    const halfOfWidth = windowWidth / 2;

    const paths = [
      `M0,${BUBBLE_BOX_EFFECT_HEIGHT} Q${halfOfWidth},-${BUBBLE_BOX_EFFECT_HEIGHT},${windowWidth},${BUBBLE_BOX_EFFECT_HEIGHT} Z`,
      `M0,${BUBBLE_BOX_EFFECT_HEIGHT} L${windowWidth},${BUBBLE_BOX_EFFECT_HEIGHT} Z`,
      `M0,0 L${windowWidth},0 Z`,
      `M0,0 Q${halfOfWidth},${BUBBLE_BOX_EFFECT_HEIGHT},${windowWidth},0 Z`,
    ];

    const morphPaths = paths.map(path => Morph.Path(path));

    return {
      initialPath: paths[0],
      effectTransitions: {
        [BUBBLE_BOX_EFFECT.UP_TO_FLAT]: Morph.Tween(morphPaths[0], morphPaths[1]), // up
        [BUBBLE_BOX_EFFECT.FLAT_TO_UP]: Morph.Tween(morphPaths[1], morphPaths[0]), // full
        [BUBBLE_BOX_EFFECT.DOWN_TO_FLAT]: Morph.Tween(morphPaths[3], morphPaths[2]), // zero
        [BUBBLE_BOX_EFFECT.FLAT_TO_DOWN]: Morph.Tween(morphPaths[2], morphPaths[3]), // down
      },
    };
  }, [windowWidth]);

  const [effectPath, setEffectPath] = useState(initialPath);

  const effectSVGPath = useMemo(() => new SVGPath(), []);

  const changeEffectPath = useCallback((type: BubbleBoxEffectType, value: number, updatePath?: boolean = true) => {
    effectTransitions[type].tween(value);
    if (updatePath) {
      effectTransitions[type].applyToPath(effectSVGPath);
      setEffectPath(effectSVGPath.path);
    }
  }, [effectTransitions, effectSVGPath]);

  return {
    effectPath,
    changeEffectPath,
  };
}
