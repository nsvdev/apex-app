import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity as RNTouchableOpacity, BackHandler, Keyboard, Platform, View } from 'react-native';
import styled from 'styled-components/native';
import { Input, InputProps } from 'react-native-elements';
import { Colors, Fonts, TEXT_SIZE_13, TEXT_SIZE_15, TEXT_SIZE_12 } from '../constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { ModalBottom, StyledText } from 'components'
import { isIos } from 'utils';
import { TouchableOpacity as GestureTouchableOpacity } from 'react-native-gesture-handler'

const TouchableOpacity = Platform.OS === 'ios' ? GestureTouchableOpacity : RNTouchableOpacity

interface Props extends InputProps {
  placeholder?: string
  rightIconType?: 'datePicker' | 'picker' | 'money' | 'timePicker',
  onChangePicker?: (value) => void
  label?: string
  onChangeText?: (text) => void
  value: string,
  containerStyle?: object
  rightIconPress?: () => void
  style?: object
  onPress?: () => void,
  disabled?: boolean,
  pickerItems?: string[],

  onItemChange?: (index) => void
  pickerData?: string[]
  selectedItem?: number

  autoCapitalize?
  maxLength?: number

  onSwipeOut?
  onButtonPress?

  containerBackground?: string
}

const getRightIcon = (iconType) => {
  switch (iconType) {
    case 'datePicker':
      return (
        <Image
          source={require('assets/images/icons/calendar_icon.png')}
          style={{ width: 20.53, height: 15, marginRight: 15 }}
        />
      )
      
    case 'picker':
      return (
        <Image
          source={require('assets/images/icons/arrow-bottom.png')}
          style={{ width: 12, height: 7, marginRight: 15 }}
        />
      )
    case 'timePicker':
      return (
        <Image
          source={require('assets/images/icons/arrow-bottom.png')}
          style={{ width: 12, height: 7, marginRight: 15 }}
        />
      )
    case 'money':
      return (
        <StyledText color={'#C8C7CC'} size={3.5}>₽</StyledText>
      )


      
      
    default:
      break;
  }
}

const rightIconPress = (props: Props, action?) => {
  switch (props.rightIconType) {
    case 'datePicker':
      props.rightIconPress()
      break;

    case 'timePicker':
      props.rightIconPress()
      break;

    case 'picker':
      action()
      break;
  
    default:
      break;
  }
  props.rightIconPress
}


const StyledInput = (props: Props) => {
  const [modalVisible, toggleModal] = useState(false);

  const hideModal = (props) => {
    setTimeout(() => {
      toggleModal(false)
    }, 100);
    return modalVisible ? true : false
  }

  // useEffect(() => {
  //   if (modalVisible) {
  //     BackHandler.addEventListener('hardwareBackPress', () => hideModal(props))
  //   } else {
  //     BackHandler.removeEventListener('hardwareBackPress', () => hideModal(props))
  //   }
  // }, [modalVisible])

  return (
    <TouchableOpacity
      disabled={props.rightIconType ? false : true}
      // disabled
      style={{ flex: 1, ...props.style }}
      onPress={() => rightIconPress(props, () => toggleModal(true))}
    >
      <Input
        onFocus={props.disabled ? () => {
          Keyboard.dismiss()
          rightIconPress(props, () => toggleModal(true))
        } : () => {
          if (props.onFocus) {
            props.onFocus()
          }
        }}
        disabled={props.disabled}
        disabledInputStyle={{ opacity:1 }}
        autoCapitalize={props.autoCapitalize}
        value={props.value}
        onChangeText={props.onChangeText}
        label={props.value ? props.label : null}
        placeholder={props.value ? '' : (props.placeholder || props.label)}
        placeholderTextColor={`#666666`}
        keyboardType={props.keyboardType}
        rightIcon={props.rightIconType
          ? (
            <View style={{ position: 'absolute', right: 0, alignSelf: 'center', top: props.value ? 12 : 20 }}>
              <TouchableOpacity onPress={() => rightIconPress(props, () => toggleModal(true))}>
                {getRightIcon(props.rightIconType)}
              </TouchableOpacity>
            </View>
            
          )
          : false
            
        }
        containerStyle={{
          backgroundColor: props.containerBackground || Colors.grayLight,
          // height: 50,
          paddingLeft: 20,
          height: 50,
          paddingTop: props.value ? 8 : 12,
          paddingBottom: 8,
          marginVertical: 1,
          ...props.containerStyle
        }}
        labelStyle={{
          fontSize: 11,
          height: 13,
          color: Colors.gray,
          fontWeight: '400',
          fontFamily: Fonts.medium
        }}
        inputContainerStyle={{
          borderBottomWidth: 0,
          // borderWidth: 1,
          height: props.value ? 19 : 23,
          marginLeft: isIos ? 0 : -5,
        }}
        inputStyle={{
          fontSize: RFPercentage(props.value ? TEXT_SIZE_13 : TEXT_SIZE_12)
        }}
        maxLength={props.maxLength}
        // {...props}
      />



      <ModalBottom
        selectedItem={props.selectedItem}
        visible={modalVisible}
        type="picker"
        title={props.label}
        onButtonPress={() => {
          if (!props.selectedItem) {
            props.onItemChange(0)
          }

          if (props.onButtonPress) {
            props.onButtonPress()
          }

          toggleModal(false)
        }}
        onSwipeOut={() => {
          if (props.onSwipeOut) {
            props.onSwipeOut()
          }
          toggleModal(false)
        }}
        onItemChange={(index) => props.onItemChange(index)}
        pickerData={props.pickerData}
        maximumDate={new Date()}
      />
    </TouchableOpacity>
  )
}

export default StyledInput


