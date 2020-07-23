// @flow

type CardItemType = {|
  cardId: number,
  backgroundColor: string,
  indicatorActiveColor: string,
  summaryCardImage: any,
  fullCardImage: any,
|};

export default ([
  {
    cardId: 1,
    backgroundColor: '#a1b9d8',
    indicatorActiveColor: '#0074b7',
    summaryCardImage: require('~/assets/card1.png'),
    fullCardImage: require('~/assets/card1_focus.png'),
  },
  {
    cardId: 2,
    backgroundColor: '#facb94',
    indicatorActiveColor: '#ff8300',
    summaryCardImage: require('~/assets/card2.png'),
    fullCardImage: require('~/assets/card2_focus.png'),
  },
  {
    cardId: 3,
    backgroundColor: '#b3efcb',
    indicatorActiveColor: '#18a558',
    summaryCardImage: require('~/assets/card3.png'),
    fullCardImage: require('~/assets/card3_focus.png'),
  },
]: CardItemType[]);
