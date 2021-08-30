import React from 'react';
import { Image } from 'react-native';
import { CheckBox } from 'react-native-elements'
import moment from 'moment';
import 'moment/locale/es'
import { Fonts, TEXT_SIZE_11, Colors } from 'constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


interface Props {
  title: string
  checked?: boolean
  onPress: () => void,
  radioButton?: boolean
}

const icons = [
  require(`../assets/images/icons/radio-inactive.png`),
  require(`../assets/images/icons/radio-active.png`),
  require(`../assets/images/icons/radio-inactive.png`),
  require(`../assets/images/icons/checkBox-active.png`)
]

const boxImage = (isRadio: boolean, checked: boolean) => (
  <Image
    resizeMode='contain'
    source={isRadio ? icons[checked ? 1 : 0] : icons[checked ? 3 : 2]}
    style={{ width: 30, height: 30 }}
  />
)

const CheckBoxComponent = (props: Props) => (
  <CheckBox
    title={props.title}
    checked={props.checked}
    containerStyle={{
      backgroundColor: 'transparent',
      borderWidth: 0,
      paddingLeft: 0,
      marginLeft: 0
    }}
    textStyle={{ fontFamily: Fonts.medium, fontSize: RFPercentage(TEXT_SIZE_11) }}
    onPress={props.onPress}
    checkedIcon={boxImage(props.radioButton, true)}
    uncheckedIcon={boxImage(props.radioButton, false)}
  />
)

export default CheckBoxComponent;