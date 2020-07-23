## Other React Native Toys
https://react-native.toys

## Bubble Pay
### Preview
![Screenshot](screenshots/bubble-pay.gif)

### Features
1. High Performance : No problem in low-end devices
2. Low Dependency : Uses only ART
3. All Platforms : Works on iOS/Android
4. Hooks : All function components with hooks
5. No errors : Flow & eslint all passed

### How to build and run
```shell
$ git clone https://github.com/ifsnow/BubblePay.git
$ cd BubblePay
$ yarn install
$ cd ios
$ pod install
$ cd ..
$ react-native run-ios
```

### Reason for using ART instead of react-native-svg
`ART` is a built-in library included in the core up to RN 0.61. I know `react-native-svg` provides more functionality, but I wanted to show you how to implement it with low dependency. :)

### Related Project
[Animated Blob](https://github.com/ifsnow/AnimatedBlob)

## Reasons to continue this toy project
I hope this helps someone. If so, I would be happy to prepare these.

## Thanks
- Card images : [react-credit-cards](https://amarofashion.github.io/react-credit-cards/)
