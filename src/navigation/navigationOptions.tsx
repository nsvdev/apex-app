import { Colors, TEXT_SIZE_11 } from '../constants';
import { Image, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { isIos } from 'utils';
import { StyledText } from 'components';

export const imageStyle = { marginHorizontal: 20  }
export const logoStyle = { ...imageStyle, width: 83, height: 16,  }
export const  burgerStyle = { ...imageStyle, width: 23, height: 20,  }
export const backStyle = { ...imageStyle, width: 20, height: 20, marginHorizontal: 0, marginLeft: isIos ? 20 : 10  }

export const navigationOptions = ({ navigation }) => ({
  title: null,
  // headerTintColor: 'white',
  headerStyle: {
    backgroundColor: Colors.background,
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0,
  },
  headerLeft: () => (
    <Image resizeMode="contain" source={require('assets/images/logo.png')} style={logoStyle} />
  ),
  headerRight: () => (
    <TouchableOpacity style={{ margin: 0 }} onPress={navigation.toggleDrawer}>
      <Image resizeMode="contain" source={require('../assets/images/burger.png')} style={burgerStyle} />
    </TouchableOpacity>
  ),
})

export const optionsWithBack = ({ navigation }) => ({
  title: null,
  // headerTintColor: 'white',
  headerStyle: {
    backgroundColor: Colors.background,
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0,
  },
  headerRight: () => (
    <TouchableOpacity style={{ margin: 0 }} onPress={navigation.toggleDrawer}>
      <Image resizeMode="contain" source={require('../assets/images/burger.png')} style={burgerStyle} />
    </TouchableOpacity>
  ),
  headerBackTitle: ' ',
  headerBackImage: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        resizeMode="contain"
        source={require('assets/images/back.png')}
        style={backStyle}
      />
      <Image resizeMode="contain" source={require('assets/images/logo.png')} style={logoStyle} />
    </View>
    
  )
})


export const optionsWithBackTitle = ({ navigation }, title) => ({
  title: null,
  // headerTintColor: 'white',
  headerStyle: {
    backgroundColor: Colors.background,
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0,
  },
  headerRight: () => (
    <TouchableOpacity style={{ margin: 0 }} onPress={navigation.toggleDrawer}>
      <Image resizeMode="contain" source={require('../assets/images/burger.png')} style={burgerStyle} />
    </TouchableOpacity>
  ),
  headerBackTitle: ' ',
  headerBackImage: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        resizeMode="contain"
        source={require('assets/images/back.png')}
        style={backStyle}
      />
      <StyledText size={TEXT_SIZE_11} style={{ marginLeft: 10 }}>{title}</StyledText>
    </View>
  )
})


export const modalNavigationOptions = {
  ...navigationOptions,
  headerLeft: null
}