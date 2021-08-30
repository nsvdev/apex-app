import React from 'react';
import { Image, TouchableOpacity, Keyboard, View, BackHandler } from 'react-native';
import styled from 'styled-components/native';
import { Input, InputProps } from 'react-native-elements';
import { Colors, Fonts, TITLE_SIZE, TEXT_SIZE_15, TEXT_SIZE_13, SCREEN_HEIGHT } from '../constants';
import {
  TextInputMask,
  TextMask
} from "react-native-masked-text";
import ModalBottom from './ModalBottom'
import StyledText from './StyledText';
import { MainButton } from './Buttons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

interface Props extends InputProps {
  value: string
  // onHintPress: () => void,
  hintTitle?: string
  hintDescription?: string,
  hintVisible?: boolean,
  onSwipeOut?: () => void
}

class TotalAmount extends React.PureComponent<Props> {

  state = {
    hintModalVisible: false
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hintModalVisible) {
      BackHandler.addEventListener('hardwareBackPress', this.hideModal)
    } else {
      BackHandler.removeEventListener('hardwareBackPress', this.hideModal)
    }
  }

  hideModal = () => {
    setTimeout(() => {
      this.setState({ hintModalVisible: false })
    }, 100);
    return this.state.hintModalVisible ? true : false
  }

  render() {
    const { value, hintVisible, hintTitle, hintDescription } = this.props;

    return (
      <Container {...this.props}>
        <TextMask
          type={'money'}
          options={{
            precision: 0,
            separator: ' ',
            delimiter: ' ',
            unit: null,
            suffixUnit: '₽'
          }}
          value={value}
          style={{
            fontSize: RFPercentage(TITLE_SIZE),
            color: 'black'
          }}
        />
        {hintVisible && (
          <TouchableOpacity
            style={{ width: 24, height: 24, position: 'absolute', right: 20 }}
            onPress={() => this.setState({ hintModalVisible: true })}
          >
            <Image
              source={require('assets/images/icons/hint_icon.png')}
              style={{ width: '100%', height: '100%' }}
            />
          </TouchableOpacity>
        )}

        <ModalBottom
          visible={this.state.hintModalVisible}
          type="alert"
          title={hintTitle}
          description={hintDescription}
          onButtonPress={() => this.setState({ hintModalVisible: false })}
          onSwipeOut={() => this.setState({ hintModalVisible: false })}
          height={SCREEN_HEIGHT < 650 ? RFPercentage(TEXT_SIZE_13 * 35) : RFPercentage(TEXT_SIZE_13 * 26)}
        />
      </Container>
    )
  }
}

const Container = styled.View`
  height: 80px;
  width: 100%;
  background-color: rgba(226, 226, 226, 0.5);
  border-radius: 10px;
  align-items: center;
  padding-horizontal: 20px;
  flex-direction: row;
`

const ModalContainer = styled.View`
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 20px;
  padding-horizontal: 20px;
`

export default TotalAmount