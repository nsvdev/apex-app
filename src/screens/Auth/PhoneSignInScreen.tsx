import React from 'react';
import { Keyboard, TouchableOpacity, Text, View } from 'react-native'
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { setPhone, sendSms } from 'redux/actions'
import { connect } from 'react-redux'
import { authSelector } from 'redux/selectors';
import { MainButton, StyledText, TextInputMask, TextButton } from 'components';
import { Colors, TITLE_TOP, DESCRIPTION_TOP } from 'constants';
import { cutPhone, isIos } from 'utils';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

interface Props {
  navigation: any,
  dispatch: any,
  route,
  isFetching: boolean,
  auth: IAuthStore
}

export class PhoneSignInScreen extends React.Component<Props> {
  state = {
    phone: this.props.route.params.phoneNumber,
    inputComplete: false,
    keyboardOffset: 0
  }

  componentDidMount() {
    const pgoneNumber = this.props.route.params.phoneNumber
    // check phone...
    this.setState({ inputComplete: true })
  }

  onEnter = () => {
    const
      { navigation, dispatch } = this.props,
      { phone } = this.state

    const cuttedPhone = cutPhone(phone)

    dispatch(setPhone(cuttedPhone))
    dispatch(sendSms(phone, null, navigation))
  }

  onChangeText = (text) => {
    if (text.slice(0, 2) === '+7') {
      if (text.length >= 16) {
        Keyboard.dismiss();
        this.setState({
          inputComplete: true,
          phone: text
        })
      } else {
        this.setState({
          inputComplete: false,
          phone: text
        })
      }
    }
    
  }

  onKeyboardDidShow = ({ endCoordinates: { height } }) => {
    this.setState({ keyboardOffset: isIos ? height - 55 :  - 55 }) // height - 10
  }

  onKeyboardDidHide = ({ endCoordinates: { height } }) => {
    this.setState({ keyboardOffset: 0 })
  }

  render() {
    const
      { navigation } = this.props,
      { phone, inputComplete, keyboardOffset } = this.state

    return (
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1, width: '100%', backgroundColor: Colors.background }}
          contentContainerStyle={{
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: 20,
          }}
          enableOnAndroid={true}
          extraScrollHeight={10}
          // extraHeight={140}
          enableAutomaticScroll={false}
          onKeyboardDidShow={this.onKeyboardDidShow}
          onKeyboardDidHide={this.onKeyboardDidHide}
        >
          <TextWrapper>
            <StyledText isTitle style={{ marginTop: TITLE_TOP }}>Вход по номеру</StyledText>
            <StyledText isTitle>телефона</StyledText>
          
            <Terms>
              <StyledText size={2} color={Colors.gray}>Продолжая, я соглашаюсь с </StyledText>
              <StyledText size={2} onPress={() => navigation.navigate('LicenseAgreement')}>
                пользовательским соглашением,
              </StyledText>
              <StyledText size={2} color={Colors.gray}> а также с обработкой моей персональной информации на </StyledText>
              <StyledText size={2} onPress={() => navigation.navigate('PrivacyPolicy')}>
                условиях политики конфиденциальности
              </StyledText>
            </Terms>
          </TextWrapper>
         
          <BottomWrapper bottom={keyboardOffset}>
            <TextInputMask
              label={'Вход по номеру телефона'}
              type={'custom'}
              options={{
                mask: '+7 999 999-99-99',
                validator: function(value, settings) {
                  return true
                },
                getRawValue: function(value, settings) {
                  return value;
                },
              }}
              value={phone}
              onChangeText={this.onChangeText}
              complete={inputComplete}
              // onChangeText={(phone) => console.log(phone)}
              style={{ fontSize: 18 }}
            />
            <MainButton
              style={{ marginTop: 10 }}
              onPress={this.onEnter}
              title='Войти'
              disabled={!inputComplete}
            />
          </BottomWrapper>
         

        </KeyboardAwareScrollView>
    );
  }
}

export default connect(authSelector)(PhoneSignInScreen)

const TextWrapper = styled.View`
  width: 100%;
`;

const BottomWrapper: any = styled.View`
  width: 100%;
  position: absolute;
  bottom: ${(props: any) => props.bottom ? `${props.bottom}px` : '20px'};
`;

const Terms: any = styled.Text`
  margin-top: 1%;
`;