// @flow

import React, { useCallback } from 'react';
import {
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import { normalizeSizeWithWidth } from './utils';

import { HITSLOP_SUMMARY } from './constancts';

type Props = {|
  index: number,
  imageSource: any,
  onPressCard: (index: number) => mixed,
|};

const CardSummary = ({
  index,
  imageSource,
  onPressCard,
}: Props) => {
  const onPress = useCallback(() => {
    onPressCard(index);
  }, [index, onPressCard]);

  return (
    <TouchableWithoutFeedback onPress={onPress} hitSlop={HITSLOP_SUMMARY}>
      <Image source={imageSource} style={styles.image} />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  image: {
    width: normalizeSizeWithWidth(200),
    height: normalizeSizeWithWidth(126),
  },
});

export default React.memo<Props>(CardSummary);
