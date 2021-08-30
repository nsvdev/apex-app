import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import StyledText from './StyledText';
import { Colors, TEXT_SIZE_15 } from '../constants';
import { ActivityIndicator } from 'react-native';

interface MainButtonProps {
  title: string
  onPress: Function
  textSize?: number,
  isLoading?: boolean
  disabled?: boolean
  style?: object
  textStyle?: object
  dashed?: boolean
  remove?: boolean
  gosUslugi?: boolean
}
export class MainButton extends React.PureComponent<MainButtonProps> {
  render() {
    const { title, onPress, isLoading, disabled, style, textStyle, dashed, gosUslugi } = this.props;

    return (
      <MainButtonContainer
        disabled={isLoading}
        activeOpacity={disabled ? 1 : 0.2}
        style={style}
        onPress={!disabled ? onPress : null}
        dashed={dashed}
      >
        {this.props.remove ? (
            <Image
              source={require('assets/images/icons/trash.png')}
              style={{ width: 14, height: 18, marginRight: 10 }}
            />
          ) : null}

        {isLoading ? <ActivityIndicator size="small" color="white" /> : (
          <StyledText
            // size={2.5}
            style={{ opacity: disabled ? 0.5 : 1, ...textStyle }}
            color={dashed ? Colors.blue : '#FFFFFF'}
            size={TEXT_SIZE_15}
            bold
          >
            {title}
          </StyledText>
        )}
        

        {gosUslugi ? (
          <Image
            source={require('assets/images/gosuslugi.png')}
            style={{ width: 27.6, height: 30, marginLeft: 10 }}
          />
        ) : null}
      </MainButtonContainer>
    )
  }
}

const Wrapper = styled.View`
  align-self: center;
`;

const MainButtonContainer: any = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  background-color: ${(props: any) => props.dashed ? 'white' : Colors.blue};
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  border-style: ${(props: any) => props.dashed ? 'dashed' : 'solid'};
  border-width: ${(props: any) => props.dashed ? '1px' : '0px'};
  border-color: ${(props: any) => props.dashed ? 'rgba(29, 90, 203, 0.3)' : 'white'};
  flex-direction: row;
`;

interface TextButtonProps extends MainButtonProps {
  style?: object
  textColor?: string
  textProps?: object
}
export class TextButton extends React.PureComponent<TextButtonProps> {
  render() {
    const {
      title,
      textSize,
      style,
      onPress,
      textColor,
      textProps,
      children
    } = this.props;

    return (
      <TextButtonContainer style={style} onPress={onPress}>
        <StyledText size={textSize} color={textColor || Colors.black} {...textProps}>
          {title || children}
        </StyledText>
      </TextButtonContainer>
    )
  }
}
const TextButtonContainer: any = styled.TouchableOpacity`
  /* flex-wrap: wrap; */
`;