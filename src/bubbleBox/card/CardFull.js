// @flow

import React, {
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import CardFullContent from './CardFullContent';
import NumberPad from './NumberPad';
import BubbleBoxContext from '~/bubbleBox/BubbleBoxContext';

import { normalizeSizeWithHeight } from './utils';

import { BUBBLE_BOX_MODE } from '~/bubbleBox/types';

type Props = {|
  imageSource: any,
  indicatorActiveColor: string,
  onPressCard: () => mixed,
|};

const CardFull = ({
  imageSource,
  indicatorActiveColor,
  onPressCard,
}: Props) => {
  const {
    isBoxFull,
    setAllBoxsMode,
    isProcessing,
    setProcessing,
  } = useContext(BubbleBoxContext);

  const [payCode, setPayCode] = useState('');

  const onChangePad = useCallback((code: string) => {
    setPayCode(code);
  }, []);

  const onCompletePad = useCallback(() => {
    setProcessing(true);
  }, [setProcessing]);

  const onEndProcess = useCallback(() => {
    setAllBoxsMode(BUBBLE_BOX_MODE.NORMAL);
  }, [setAllBoxsMode]);

  useEffect(() => () => {
    if (isBoxFull) {
      setProcessing(false);
    }
  }, [isBoxFull, setProcessing]);

  return (
    <View style={styles.container}>
      <CardFullContent
        isBoxFull={isBoxFull}
        isProcessing={isProcessing}
        imageSource={imageSource}
        payCode={payCode}
        onEndProcess={onEndProcess}
        onPressCard={onPressCard}
      />
      <NumberPad
        isEnabled={isBoxFull && !isProcessing}
        indicatorActiveColor={indicatorActiveColor}
        onChange={onChangePad}
        onComplete={onCompletePad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: normalizeSizeWithHeight(200),
  },
});

export default React.memo<Props>(CardFull);
