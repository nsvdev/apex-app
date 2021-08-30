import React from 'react';
import { Keyboard, View, Text, Platform } from 'react-native'
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { signIn, sendSms, resetCode } from 'redux/actions'
import { connect } from 'react-redux'
import { checkEmail, checkEmptyString, isIos } from 'utils';
import { authSelector } from 'redux/selectors';
import { MainButton, StyledText, TextInputMask } from 'components';
import { TITLE_TOP, DESCRIPTION_TOP, Colors } from '../../constants';
import Timer from 'react-compound-timer'
import { cutPhone } from 'utils';

interface Props extends IAuthStore {
  navigation: any,
  dispatch: any,
  route,
  isFetching: boolean,
  auth: IAuthStore
}

export class CodeInputScreen extends React.Component<Props> {
  state = {
    code: '',
    inputComplete: false,
    keyboardOffset: 0,
    timerCompleted: false,
    placeholderWidth: 0
  }

  componentDidMount() {

  }

  onEnter = () => {
    this.forceUpdate()

    const
      { navigation, dispatch, auth, } = this.props,
      { code, timerCompleted } = this.state

    if (timerCompleted) {
      dispatch(sendSms(auth.phone, true, navigation))
      this.setState({ time: 60, timerCompleted: false })
    } else {

      // navigation.navigate('ServiceCreation')

      dispatch(signIn({
        phone: auth.phone,
        code,
        navigation,
        navigateTo: this.props.route.params['fromServices'] ? 'PenaltyCreation' : null
      }))
    }
  }

  onChangeText = (text) => {
    const
      { navigation, dispatch, auth } = this.props,
      { code } = this.state

    if (text.length >= 4) {
      // Keyboard.dismiss();
      this.setState({
        inputComplete: true,
        code: text
      })
    } else {
      dispatch(resetCode())
      this.setState((prevState) => ({
        inputComplete: false,
        code: text
      }))
    }
  }

  onKeyboardDidShow = ({ endCoordinates: { height } }) => {
    this.setState({ keyboardOffset: height + 10 })
  }

  onKeyboardDidHide = ({ endCoordinates: { height } }) => {
    this.setState({ keyboardOffset: 0 })
  }

  render() {
    const
      { codeError, isFetching } = this.props.auth,
      { code, inputComplete, keyboardOffset, timerCompleted, placeholderWidth } = this.state,
      phoneNumber = this.props.route.params.phoneNumber

    return (
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1, width: '100%', backgroundColor: 'white' }}
          contentContainerStyle={{
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: 20
          }}
          enableOnAndroid={true}
          extraScrollHeight={10}
          enableAutomaticScroll={false}
          onKeyboardWillShow={this.onKeyboardDidShow}
          onKeyboardWillHide={this.onKeyboardDidHide}
        >
          <TextWrapper>
            <StyledText isTitle style={{ marginTop: TITLE_TOP }}>Вход по номеру</StyledText>
            <StyledText isTitle>телефона</StyledText>

            <StyledText style={{ marginTop: DESCRIPTION_TOP }}>
              Введите код из смс, отправленного на номер 
              
            </StyledText>
            <StyledText>{phoneNumber}</StyledText>
          </TextWrapper>
         
          <BottomWrapper bottom={keyboardOffset}>
            <Form>
              <Placeholder
                onLayout={({nativeEvent}) => this.setState({ placeholderWidth: nativeEvent.layout.width })}
                style={{ width: placeholderWidth !== 0 ? placeholderWidth : null }}
              >
                  {Array(4 - code.length).fill(0).map(i => (
                    <Text
                      style={{
                        paddingHorizontal: isIos ? 4 : 6,
                        fontSize: 18,
                        color: '#D1D5DB',
                        textAlign: 'center'
                      }}
                    >
                      ●
                    </Text>
                  ))}
              </Placeholder>
              
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '9999',
                  validator: function(value, settings) {
                    return true
                  },
                  getRawValue: function(value, settings) {
                    return value;
                  },
                }}
                value={code}
                onChangeText={this.onChangeText}
                // complete={inputComplete}
                // placeholder={'●●●●'}
                style={{
                  minWidth: 160,
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  letterSpacing: 15,
                  fontSize: 18,
                  color: codeError ? Colors.red : Colors.black
                }}
              />

              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  // paddingTop: 15,
                  minWidth: '40%'
                }}
              >
                {codeError && <StyledText style={{ lineHeight: 13 }} size={1.8} color={Colors.red}>Неверный код</StyledText>}
                {!timerCompleted && (
                  <Timer
                    // @ts-ignore
                    ref={r => this.timeRef = r}
                    formatValue={(value: any) => `${(value < 10 ? `0${value}` : value)}`}
                    initialTime={30 * 1000}
                    direction="backward"
                    timeToUpdate={10}
                    checkpoints={[
                        {
                            time: 0,
                            callback: () => this.setState({ timerCompleted: true }),
                        },
                    ]}
                  >
                    <View style={{ alignItems: 'flex-start', width: '60%', }}>
                      <View style={{ flexDirection: codeError ? 'column' : 'column' }}>
                        <StyledText
                          style={{ lineHeight: 14 }}
                          size={1.8}
                          color={Colors.gray}
                        >
                          Отправить еще код через {<Timer.Seconds />} сек
                        </StyledText>
                      </View>
                    </View>
                  </Timer>
                )}
              </View>
              
             
            </Form>
            <MainButton
              style={{ marginTop: 10 }}
              onPress={this.onEnter}
              title={timerCompleted ? 'Отправить код' : 'Войти'}
              disabled={(!inputComplete || isFetching) && !timerCompleted}
            />
          </BottomWrapper>
         

        </KeyboardAwareScrollView>
    );
  }
}

export default connect(authSelector)(CodeInputScreen)

const TextWrapper = styled.View`
  width: 100%;
`;

const BottomWrapper: any = styled.View`
  width: 100%;
  position: absolute;
  bottom: ${(props: any) => props.bottom ? `${props.bottom}px` : '20px'};
`;

const Form: any = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Placeholder: any = styled.View`
  /* width: 130px; */
  position: absolute;
  left: 20px;
  /* top: ${Platform.OS === 'ios' ? '33px' : '40px'}; */
  flex-direction: row;
  justify-content: flex-end;
`;

