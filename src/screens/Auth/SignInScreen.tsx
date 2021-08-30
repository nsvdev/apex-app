import React from 'react';
import { Alert, Keyboard, Modal, Platform, View } from 'react-native'
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { setPhone, setToken, getApplications } from 'redux/actions'
import { connect } from 'react-redux'
import { checkEmail, checkEmptyString, isIos } from 'utils';
import { authSelector } from 'redux/selectors';
import { MainButton, StyledText, TextInputMask, MainLayout } from 'components';
import { Colors, TITLE_TOP, DESCRIPTION_TOP, TEXT_SIZE_15, SCREEN_HEIGHT } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import moment from 'moment'
import {
  encode, decode, trim,
  isBase64, isUrlSafeBase64
} from 'url-safe-base64'
import Api from 'api';
import { dispatch } from 'navigation';
import { DrawerActions, StackActions } from '@react-navigation/native';
import { setUser } from 'redux/actions/user';

interface Props {
  navigation: any,
  dispatch: any,
}

export class SignInScreen extends React.Component<Props> {
  state = {
    phone: '+7',
    inputComplete: false,
    keyboardOffset: 0,
    showGosUslugi: false,
    gosUslugiUrl: '',
    showUslugiBtn: true
  }

  componentDidMount() {
    // разлогин происходит в DrawerContent
  }

  componentWillUnmount() {
    
  }

  signInHandler = () => {
    const
      { dispatch } = this.props,
      { phone } = this.state

    // без пробелов

    dispatch(setPhone(phone))
  }

  onEnter = () => {
    const
      { navigation } = this.props,
      { phone } = this.state
    
    navigation.navigate('PhoneSignIn', { phoneNumber: phone })
  }

  onEnterGosUslugi = async () => {
    // BackHandler.addEventListener('hardwareBackPress', this.hideModal)

    const urlData = await Api.Auth.getEsiaUrl()
    this.setState({ showGosUslugi: true })
    
    if (urlData.data.success) {

      this.setState({
        gosUslugiUrl: urlData.data.data
      }, () => this.setState({ showGosUslugi: true }))
    }
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
    this.setState({
      keyboardOffset: isIos ? height - 45 :  - 55,
      showUslugiBtn: false
    }) // height + 10
  }

  onKeyboardDidHide = ({ endCoordinates: { height } }) => {
    this.setState({
      keyboardOffset: 0,
      showUslugiBtn: true
    })
  }

  onNavigationStateChange = async (url_string) => {
    var url = new URL(url_string);

    // если url == 'law-app.ru'
    if (url_string.split('/')[2] === 'law-app.ru') {
      // alert('ddd')
    }

    try {
      // code key?
      if (url_string.split('?')[1].split('=')[0] === 'code') {
        
        const code = url_string.split('?')[1].slice(5).split('&')[0]

        // console.log(code)
        let authData = null
        try {
          authData = await Api.Auth.esia(code)
        } catch (err) {
          if (err.response) {
            // alert(JSON.stringify(err.response.data.error.message))
            console.log(JSON.stringify(err.response.data.error.message))
          }
        }

        if (authData.data.success) {
          this.props.dispatch(setToken(authData.data.data))
          setTimeout(async () => {
            const userData = await Api.User.getUserData()
            if (userData.status === 200) {
              const { name, last_name, middle_name, phone } = userData.data.data

              this.props.dispatch(setUser({
                name,
                middleName: middle_name,
                lastName: last_name,
                phone
              }))
            } else {
              Alert.alert('Ошибка', 'Ошибка при получении данных пользователя')
            }
            console.log(userData)
          }, 1000);
          
          this.setState({ showGosUslugi: false }, () => {
            // getting user data

            const jumpToAction = DrawerActions.jumpTo('Services');
            this.props.navigation.dispatch(jumpToAction)
          })

          setTimeout(() => {
            this.props.dispatch(getApplications())
          }, 1000);
        }
      }
    } catch (err) {
      // console.log(err.response)
    }
  }

  render() {
    const { phone, inputComplete, keyboardOffset } = this.state

    return (
      <MainLayout>
        <KeyboardAwareScrollView
          // keyboardShouldPersistTaps="handled"
          style={{ flex: 1, width: '100%', backgroundColor: 'white' }}
          contentContainerStyle={{
            alignItems: 'center',
            flex: 1,
            // paddingHorizontal: 20
          }}
          enableOnAndroid={false}
          
          extraScrollHeight={0}
          // extraHeight={140}
          enableAutomaticScroll={false}
          onKeyboardDidShow={this.onKeyboardDidShow}
          onKeyboardDidHide={this.onKeyboardDidHide}
        >
          <TextWrapper>
            <StyledText isTitle style={{ marginTop: TITLE_TOP }}>Вход</StyledText>
            <StyledText isTitle>и регистрация</StyledText>

            {keyboardOffset < 0 && SCREEN_HEIGHT < 600 ? null : (
              <StyledText style={{ marginTop: DESCRIPTION_TOP }}>
               Для взыскания неустойки с застройщика нам потребуются Ваши личные (персональные) данные, которые будут указаны в исковом заявлении (претензии) и иных документах по делу. В случае регистрации в приложении через портал Госуслуг данные будут заполнены автоматически
              </StyledText>
            )}
            
          </TextWrapper>
         

          {this.state.showUslugiBtn ? (
            <MainButton
              style={{
                marginTop: SCREEN_HEIGHT / 4.5,
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#E2E2E2',
                borderRadius: 5
              }}
              onPress={() => this.onEnterGosUslugi()}
              title='Войти через ГосУслуги'
              textStyle={{ color: Colors.blue }}
              gosUslugi
            />
          ) : null}
          

          <BottomWrapper
            bottom={Platform.OS === 'ios' ?  this.state.keyboardOffset : (this.state.keyboardOffset === 0 ? 0 : -50)}>
            {/* <StyledText
              style={{ position: 'absolute', zIndex: 999, bottom: 75, left: 20 }}
              size={TEXT_SIZE_15}
              color={Colors.gray}
            >
              +7
            </StyledText> */}

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
              // complete={inputComplete}
              // onChangeText={(phone) => console.log(phone)}
            />
            
            <MainButton
              style={{
                marginTop: 10
              }}
              onPress={this.onEnter}
              title='Войти'
              disabled={!inputComplete}
            />
          </BottomWrapper>
         

        </KeyboardAwareScrollView>


        <Modal
          visible={this.state.showGosUslugi}
          animationType={'slide'}
          transparent={false}
          presentationStyle="overFullScreen"
          onRequestClose={() => {
            this.setState({
              showGosUslugi: false
            })
          }}
        >
          <View>
            <CloseButton
              onPress={() => {
                this.setState({ showGosUslugi: false })
              }}
              style={{ top: isIos ? 40 : 20 }}
            >
              <CloseImage
                source={require('assets/images/close_blue.png')}
              />
            </CloseButton>
          </View>
          
          <View style={{ flex: 1, marginTop: isIos ? 80 : 60 }}>
            <WebView
              source={{
                uri: this.state.gosUslugiUrl
              }}
              onNavigationStateChange={(navEvent)=> this.onNavigationStateChange(navEvent.url)}
            />
          </View>
          
        </Modal>

        </MainLayout>
    );
  }
}

export default connect(authSelector)(SignInScreen)

const TextWrapper = styled.View`
  width: 100%;
`;

const BottomWrapper: any = styled.View`
  width: 100%;
  position: absolute;
  bottom: ${(props: any) => props.bottom ? `${props.bottom}px` : '20px'};
`;

const CloseButton = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 20px;
`
const CloseImage = styled.Image`
  width: 20px;
  height: 20px;
`