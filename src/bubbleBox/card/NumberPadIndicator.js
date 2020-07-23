// @flow

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import NumberPadIndicatorCircle from './NumberPadIndicatorCircle';

import {
  INDICATOR_MAX_COUNT,
  INDICATOR_PADDING_HORIZONTAL,
} from './constancts';

type Props = {|
  activeColor: string,
  activeCount: number,
|};

const NumberPadIndicator = ({
  activeColor,
  activeCount,
}: Props) => {
  const components = [];

  for (let index = 1; index <= INDICATOR_MAX_COUNT; index++) {
    const isActive = index <= activeCount;
    components.push(
      <NumberPadIndicatorCircle
        key={`indicator-${index}`}
        activeColor={activeColor}
        isActive={isActive}
      />,
    );
  }

  return (
    <View style={styles.container}>
      {components}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: INDICATOR_PADDING_HORIZONTAL,
  },
});

export default React.memo<Props>(NumberPadIndicator);
