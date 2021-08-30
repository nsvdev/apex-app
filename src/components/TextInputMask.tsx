import React from 'react';
import { View, Image, TouchableOpacity, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import {
  TextInputMask,
  TextInputMaskTypeProp,
  TextInputMaskOptionProp,
} from "react-native-masked-text";
import { Colors, TEXT_SIZE_15, TEXT_SIZE_13, TEXT_SIZE_11 } from '../constants';
import StyledText from './StyledText';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { isIos } from 'utils';
import { ModalBottom } from 'components'

interface Props {
  options?: TextInputMaskOptionProp
  type: TextInputMaskTypeProp
  value: string
  onChangeText?: (text) => void
  complete?: boolean
  style?: object
  placeholder?: string
  label?: string
  keyboardType?: string
  innerLabel?: string
  containerStyle?: object,
  rightIconPress?: () => void
  rightIconType?: 'datePicker' | 'money',
  disabled?: boolean
  onBlur?: (e) => void
  onSubmitEditing?: (e) => void
  multiline?: boolean
  innerLabelWithValue?: string
  suffixUnit?: string
}

const getRightIcon = (iconType) => {
  switch (iconType) {
    case 'datePicker':
      return require('assets/images/icons/calendar_icon.png')

    default:
      break;
  }
}
const containerStyle = (props) => ({

})
const containerStyleWithLabel = (props) => ({
  width: '100%',
  borderRadius: 6,
  backgroundColor: Colors.grayLight,
  paddingLeft: 20,
  paddingVertical: 8,
  marginVertical: 1,
  // minHeight: 50,
  height: 50,
  // height: Platform.OS === 'ios' ? 'auto' : 50,
  justifyContent: 'center',
})
const style = (props) => ({
  flexDirection: "row",
  height: 50,
  alignItems: "center",
  borderRadius: 6,
  backgroundColor: Colors.grayLight,
  // marginTop: '15%',
  // paddingTop: isIos ? 0 : 10,
  paddingLeft: 20,
  marginTop: 0,
  marginBottom: 0,
  fontSize: RFPercentage(getFontSize(props)),
  color: Colors.black,
  ...props.style
})

const getFontSize = (props) => props.value ? TEXT_SIZE_15 : TEXT_SIZE_13

const multilineFontSize = TEXT_SIZE_15

const styleWithLabel = (props: Props) => ({
  // height: RFPercentage(2.8),
  paddingLeft: 0,
  padding: 0,
  color: Colors.black,

  paddingTop: props.multiline ? (props.value ? (isIos ? 4 : 0) : (isIos ? 5 : 0)) : (props.value ? (isIos ? 0 : 0) : 0),
  width: '80%',
  fontSize: RFPercentage(props.multiline ? getFontSize(props) : getFontSize(props)),
  height: RFPercentage(props.multiline && !props.value ? TEXT_SIZE_15 * 3 : TEXT_SIZE_15 * 1.4),
  // borderWidth: 1,
  ...props.style
})

const TextInputMaskComponent = (props: Props) => {
  return (
    <TouchableWithoutFeedback onPress={props.rightIconPress}>
      <View
        style={{...props.innerLabel ? containerStyleWithLabel(props) : null, ...props.containerStyle}}
      >
        {props.label && (
          <StyledText
            style={{ marginBottom: 5 }}
            size={TEXT_SIZE_13}
            color={Colors.gray}
            // onPress={() => alert('al;aal')}
          >
            {props.label}
          </StyledText>
        )}
        
        <View style={{ justifyContent: 'center' }}>
          {props.innerLabel && props.value ? (
            <StyledText
              numberOfLines={1}
              ellipsizeMode="tail"
              size={TEXT_SIZE_11}
              // style={{ marginBottom: Platform.OS === 'ios'
              //   ? (props.multiline ? -4 : 0)
              //   : (props.multiline ? 1 : 5) }}
              style={{ marginBottom: Platform.OS === 'ios'
                ? (props.multiline ? -3 : 0)
                : (props.multiline ? 1 : 0),
              width: '80%' }}
              color={Colors.gray}
              lineHeight={RFPercentage(0.3)}
            >
              {props.innerLabelWithValue || props.innerLabel}
            </StyledText>
          ) : null}
          
          {/** touchable area */}
          {props.disabled ? (
            <TouchableOpacity
              style={{
                width: '100%',
                height: 40,
                backgroundColor: 'transparent', // 'red'
                position: 'absolute',
                zIndex: 999
              }}
              onPress={() => props.rightIconPress()}
            />
          ) : null}

          <TextInputMask
            onTouchStart={Keyboard.dismiss}
            editable={!props.disabled}
            keyboardType={props.keyboardType || "numeric"}
            type={props.type}
            options={{
              format: 'DD.MM.YYYY',
              ...props.options,
              ...props.type === 'money' ? {
                precision: 0,
                separator: '',
                delimiter: ' ',
                unit: null,
                suffixUnit: props.suffixUnit || null
              } : {}
            }}
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder={props.value ? '' : props.innerLabel}
            placeholderTextColor={`#666666`}
            multiline={props.multiline}
            numberOfLines={props.multiline ? 2 : 1}
            style={props.innerLabel ? styleWithLabel(props) : style(props)}
            onFocus={props.disabled ? Keyboard.dismiss : null}
            onBlur={props.onBlur || null}
            onSubmitEditing={props.onSubmitEditing}
          />
          

          {props.rightIconType && (
            <TouchableOpacity
              onPress={props.rightIconPress}
              style={{
                width: 20.53,
                height: 15,
                position: 'absolute',
                right: 25
              }}
            >
              {props.rightIconType === 'money' ? (
                <StyledText
                  color={'#C8C7CC'}
                  size={3.5}
                  style={{ position: 'absolute', top: -5, right: 0 }}
                >
                  ₽
                </StyledText>
              ) : null}
              <Image
                source={getRightIcon(props.rightIconType)}
                style={{
                  width: 20.53,
                  height: 15,
                }}
              />
            </TouchableOpacity>
          )}

          {props.complete &&
            <Image
              source={require('assets/images/checkmark.png')}
              style={{
                width: 15,
                height: 12,
                position: 'absolute',
                right: 20
              }}
            />}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default TextInputMaskComponent