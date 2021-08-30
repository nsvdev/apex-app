import React, { useEffect, useState } from 'react';
import { ButtonGroup } from 'react-native-elements';
import { Fonts } from '../constants';

interface Props {
  buttons: string[]
  onSelectIndex
  selectedIndex: number,
  buttonStyle?: object,
  selectedButtonStyle?: object
}

const ButtonGroupComponent = (props: Props) => {
    const buttons = props.buttons
  
  return (
    <ButtonGroup
      onPress={(index) => {
        props.onSelectIndex(index)
      }}
      selectedIndex={props.selectedIndex}
      buttons={buttons}
      containerStyle={{
        height: 40,
        borderRadius: 5,
        backgroundColor: '#F8F8F8',
        borderWidth: 0,
        padding: 4,
        width: '100%',
        marginLeft: 0,
      }}
      buttonStyle={{
        borderRadius: 3,
        ...props.buttonStyle
      }}
      selectedButtonStyle={{
        borderRadius: 3,
        backgroundColor: 'white',
        ...props.selectedButtonStyle
      }}
      innerBorderStyle={{
        color: 'transparent'
      }}
      textStyle={{
        fontSize: 11,
        color: '#1D5ACB',
        fontFamily: Fonts.regular,
        fontWeight: 'normal'
      }}
      selectedTextStyle={{
        color: 'black',
        // fontFamily: ''
      }}
    />
  );
}

export default ButtonGroupComponent
