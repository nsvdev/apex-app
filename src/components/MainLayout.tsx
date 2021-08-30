import React from 'react';
import { Colors, PADDING_SIZE, SCREEN_WIDTH } from '../constants';
import { useSafeArea } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  children,
  showShadow?: boolean
  disablePadding?: boolean
  style?: object
}

const MainLayout = (props: Props) => {
  // <SafeAreaView
  //   style={{
  //     backgroundColor: Colors.background,
  //     flex: 1
  //   }}
  // >
  const insets = useSafeArea();
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: props.disablePadding ? 0 : PADDING_SIZE,
        backgroundColor: 'white',
        paddingBottom: insets.bottom,
        ...props.style
      }}
    >
      {props.showShadow ? (
        <LinearGradient
          colors={['rgba(0,0,0,0.05)', 'transparent']}
          style={{
            height: 20,
            alignItems: 'center',
            width: SCREEN_WIDTH,
            position: 'absolute',
            top: 0,
            zIndex: 999
          }}
        />
      ) : null}
      

      {props.children}
    </View>
  )
}

export default MainLayout
