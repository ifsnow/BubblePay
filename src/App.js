// @flow

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import BubbleBoxProvider from '~/bubbleBox/BubbleBoxProvider';

import CARDS from './dummyData';

const App = () => {
  const cardComponents = CARDS.map(({
    cardId,
    backgroundColor,
    indicatorActiveColor,
    summaryCardImage,
    fullCardImage,
  }) => (
    <BubbleBoxProvider.Item
      key={`card-${cardId}`}
      cardId={cardId}
      backgroundColor={backgroundColor}
      indicatorActiveColor={indicatorActiveColor}
      summaryCardImage={summaryCardImage}
      fullCardImage={fullCardImage}
    />
  ));

  return (
    <View style={styles.container}>
      <BubbleBoxProvider>
        {cardComponents}
      </BubbleBoxProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f9',
  },
});

export default App;
