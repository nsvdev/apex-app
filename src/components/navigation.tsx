import React from 'react';
import { Button, View } from 'react-native';
import { PADDING_SIZE } from 'constants';

export const HeaderButtonContainer = (props) => (
  <View style={{ marginHorizontal: PADDING_SIZE, ...props.style }}>
    {props.children}
  </View>
)