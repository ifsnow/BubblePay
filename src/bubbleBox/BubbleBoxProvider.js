// @flow

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

import {
  BackHandler,
  useWindowDimensions,
  Platform,
} from 'react-native';

import BubbleBoxContext from './BubbleBoxContext';
import BubbleBox from './BubbleBox';
import Card from './card';

import {
  BUBBLE_BOX_MODE,
  type BubbleBoxModeType,
} from './types';

const IS_ANDROID = Platform.OS === 'android';

type Props = {|
  children: React$Element<any>[],
|};

const BubbleBoxProvider = ({
  children,
}: Props) => {
  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowDimensions();

  const itemComponentCount = children.length;
  const summaryHeight = windowHeight / itemComponentCount;
  const [isProcessing, setProcessing] = useState(false);
  const [boxModes, setBoxModes] = useState((new Array(itemComponentCount).fill(BUBBLE_BOX_MODE.NORMAL)));
  const [isBoxFull, setBoxFull] = useState(false);
  const [currentCardId, setCurrentCardId] = useState(0);
  const setAllBoxsMode = useCallback((boxMode: BubbleBoxModeType) => {
    setBoxModes(new Array(itemComponentCount).fill(boxMode));
  }, [itemComponentCount]);

  const value = {
    windowWidth,
    windowHeight,
    summaryHeight,
    boxModes,
    setAllBoxsMode,
    isBoxFull,
    setBoxFull,
    currentCardId,
    setCurrentCardId,
    isProcessing,
    setProcessing,
  };

  // Change one from `NORMAL` to `FULL` and `HIDE` others
  const openCardFull = useCallback((index: number) => {
    const newBoxModes = new Array(itemComponentCount).fill(BUBBLE_BOX_MODE.HIDDEN);
    newBoxModes[index] = BUBBLE_BOX_MODE.FULL;
    setBoxModes(newBoxModes);
  }, [itemComponentCount, setBoxModes]);

  const closeAllCards = useCallback(() => {
    if (!isProcessing) {
      setAllBoxsMode(BUBBLE_BOX_MODE.NORMAL);
    }
  }, [isProcessing, setAllBoxsMode]);

  // Android back button
  useEffect(() => {
    if (!IS_ANDROID) {
      return;
    }

    function backButtonHandler() {
      if (isBoxFull && !isProcessing) {
        closeAllCards();
        return true;
      }

      return false;
    }

    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
  }, [isBoxFull, isProcessing, closeAllCards]);

  const bubbleBoxComponents = useMemo(() => React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    const {
      cardId,
      backgroundColor,
      indicatorActiveColor,
      summaryCardImage,
      fullCardImage,
    } = child.props;

    const bubbleBoxProps = {
      cardId,
      index,
      backgroundColor,
      adjacentBackgroundColor: children[index + 1]?.props.backgroundColor ?? '#f2f4f9',
    };

    const cardComponents = [
      <Card.Summary
        key="card-summary"
        index={index}
        imageSource={summaryCardImage}
        onPressCard={openCardFull}
      />,
      <Card.Full
        key="card-full"
        imageSource={fullCardImage}
        indicatorActiveColor={indicatorActiveColor}
        onPressCard={closeAllCards}
      />,
    ];

    return React.createElement(BubbleBox, bubbleBoxProps, cardComponents);
  }), [children, openCardFull, closeAllCards]);

  return (
    <BubbleBoxContext.Provider value={value}>
      {bubbleBoxComponents}
    </BubbleBoxContext.Provider>
  );
};

type ProviderItemProps = {|
  cardId: number,
  backgroundColor: string,
  indicatorActiveColor: string,
  summaryCardImage: any,
  fullCardImage: any,
|};

// eslint-disable-next-line no-unused-vars
BubbleBoxProvider.Item = (props: ProviderItemProps) => null;

export default BubbleBoxProvider;
