import * as React from 'react';
import { View } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import {
  CommonActions,
  DrawerActions,
  StackActions
} from '@react-navigation/native';
import styled from 'styled-components/native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Colors, Fonts, TEXT_SIZE_11 } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store } from 'redux/store'
import { logout } from 'redux/actions'
import { StyledText } from 'components';


const drawerStyle = (isFocused) => ({
  backgroundColor: 'transparent'
})

const labelStyle = (isFocused) => ({
  fontSize: 15,
  color: isFocused ? Colors.gray : Colors.blue,
  fontWeight: '500',
  fontFamily: Fonts.medium
})

const DrawerContent = (props) => {
  const { state, navigation, descriptors } = props;
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'flex-start',
          paddingBottom: 15,
          paddingLeft: 20,
          paddingTop: '20%'
        }}
      >
        <CloseButton onPress={navigation.closeDrawer}>
          <CloseImage
            source={require('assets/images/close_blue.png')}
          />
        </CloseButton>
        {state.routes.map((route, i) => {
          const focused = i === state.index;
          const { title, drawerLabel, drawerIcon } = descriptors[route.key].options;
          
          switch (route.name) {
            case 'Account':
              return (
                <DrawerItem
                  key={route.key}
                  style={{
                    ...drawerStyle(focused),
                    marginTop: 20
                  }}
                  label={
                    drawerLabel !== undefined
                      ? drawerLabel
                      : title !== undefined
                      ? title
                      : route.name
                  }
                  labelStyle={labelStyle(focused)}
                  onPress={() => {
                    navigation.dispatch({
                      ...(focused
                        ? DrawerActions.closeDrawer()
                        : CommonActions.navigate(route.name)),
                      target: state.key,
                    });
                  }}
                />
              )

            case "PersonalArea":
              return (
                <DrawerItem
                  key={route.key}
                  style={drawerStyle(focused)}
                  label={drawerLabel}
                  labelStyle={{
                    ...labelStyle(focused),
                    color: '#dedede'
                  }}
                  // onPress={() => {
                  //   //@ts-ignore
                  //   store.dispatch(logout())

                  //   navigation.dispatch({
                  //     ...(focused
                  //       ? DrawerActions.closeDrawer()
                  //       : CommonActions.navigate(route.name)),
                  //     target: state.key,
                  //   });                    
                  // }}
                /> 
              )

            case 'Auth':
              return (
                <DrawerItem
                  key={route.key}
                  style={drawerStyle(focused)}
                  label={'Войти/Выйти'}
                  labelStyle={labelStyle(focused)}
                  onPress={() => {
                    //@ts-ignore
                    store.dispatch(logout())

                    navigation.dispatch({
                      ...(focused
                        ? DrawerActions.closeDrawer()
                        : CommonActions.navigate(route.name)),
                      target: state.key,
                    });

                    
                  }}
                />
              )


            case "LegalInfo":
              return (
                <DrawerItem
                  key={route.key}
                  style={drawerStyle(focused)}
                  label={drawerLabel}
                  labelStyle={labelStyle(focused)}
                  onPress={() => {
                    //@ts-ignore
                    store.dispatch(logout())

                    navigation.dispatch({
                      ...(focused
                        ? DrawerActions.closeDrawer()
                        : CommonActions.navigate(route.name)),
                      target: state.key,
                    });                    
                  }}
                />
              )
            case "AboutService":
              return (
                <DrawerItem
                  key={route.key}
                  style={drawerStyle(focused)}
                  label={drawerLabel}
                  labelStyle={labelStyle(focused)}
                  onPress={() => {
                    //@ts-ignore
                    store.dispatch(logout())

                    navigation.dispatch({
                      ...(focused
                        ? DrawerActions.closeDrawer()
                        : CommonActions.navigate(route.name)),
                      target: state.key,
                    });                    
                  }}
                /> 
              )
            case "Settings":
              return (
                <DrawerItem
                  key={route.key}
                  style={drawerStyle(focused)}
                  label={drawerLabel}
                  labelStyle={labelStyle(focused)}
                />
              )
            case "Documents":
              return (
                <DrawerItem
                  key={route.key}
                  style={drawerStyle(focused)}
                  label={drawerLabel}
                  labelStyle={labelStyle(focused)}
                />
              )

            
          
            default:
              return (
                <DrawerItem
                  key={route.key}
                  style={drawerStyle(focused)}
                  label={
                    drawerLabel !== undefined
                      ? drawerLabel
                      : title !== undefined
                      ? title
                      : route.name
                  }
                  labelStyle={labelStyle(focused)}
                  onPress={() => {
                    navigation.dispatch({
                      ...(focused
                        ? DrawerActions.closeDrawer()
                        : CommonActions.navigate(route.name)),
                      target: state.key,
                    });
                  }}
                />
              )
          }
        })}

        <View style={{ position: 'absolute', alignSelf: 'center', bottom: 30 }}>
          <StyledText>1.0.24</StyledText>
        </View>
        
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default DrawerContent;

const Label = styled.View`
  
`

const CloseButton = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 30px;
  right: 30px;
`
const CloseImage = styled.Image`
  width: 20px;
  height: 20px;
`