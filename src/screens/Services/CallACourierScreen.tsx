import React from 'react';
import { FlatList, Text, View, Image, Modal, BackHandler, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import {
  MainLayout,
  StyledText,
  TotalAmount,
  MainButton,
  StyledInput,
  ButtonGroup,
  TextButton,
  TextInputMask,
  ModalBottom
} from 'components';
import {
  TITLE_TOP,
  DESCRIPTION_TOP,
  Colors,
  MARGIN_TOP_MD,
  TEXT_SIZE_11,
  TEXT_SIZE_12,
  TEXT_SIZE_13,
  TEXT_SIZE_14,
  TEXT_SIZE_15,
  TEXT_SIZE_16,
  PADDING_SIZE,
  MARGIN_TOP_SM,
  MARGIN_TOP_LG,
  SCREEN_WIDTH
} from '../../constants';
import { connect } from 'react-redux'
import { penaltyCreationSelector } from 'redux/selectors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { num2str, errorHandler, isIos } from 'utils';
import moment from 'moment';
import DatePicker from 'react-native-date-picker'
import { clearPenalty } from 'redux/actions'
import Api from 'api';
import PenaltyCompleteModal from './PenaltyCompleteModal'
import { StackActions } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

interface Props {
  dispatch
  navigation
  penalty: IPenaltyAppilationStore
  route : {
    params: {
      documents: object[]
    }
  }
  auth: IAuthStore
}

var initTimeFrom = moment();
initTimeFrom.set({ minute:0, second:0, millisecond:0 });

class CallACourierScreen extends React.Component<Props> {

  state = {
    scrollOffset: 0,
    selectedMethod: 0,
    documents: this.props.route.params.documents || [],
    fio: null,
    address: null,
    phone: null,
    arrivalDate: null, // moment().toDate(),
    arrivalDateVisible: false,
    arrivalTimeVisible: false,
    timeFrom: initTimeFrom.toDate(),
    timeTo: initTimeFrom.add(1, 'hours').toDate(),

    completeVisible: false,
    documentsModalVisible: false,
    isLoading: false
  }

  componentDidMount() {
    this.setState({
      fio: this.props.penalty.fullName,
      phone: this.props.auth.phone,
      address: this.props.penalty.buildingAddress
    })

    // setTimeout(() => {
    //   if (__DEV__) {
    //     this.setState({
    //       arrivalDate: moment().add(1, "days").toDate(),
    //       // timeTo: initTimeFrom.add(1, 'hours') .toDate(),
    //     })
    //   }
    // }, 1000);

    BackHandler.addEventListener('hardwareBackPress', this.hideModal)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.hideModal)
  }

  hideModal = () => {
    setTimeout(() => {
      this.setState({
        arrivalDateVisible: false,
        arrivalTimeVisible: false,
        documentsModalVisible: false
      })
    }, 100);
    return this.state.arrivalDateVisible
    || this.state.arrivalTimeVisible || this.state.documentsModalVisible
    // || this.state.transferDateVisible
      ? true : false
  }

  handleScroll = ({ nativeEvent }) => {
    this.setState({ scrollOffset: nativeEvent.contentOffset.y })
  }


  _renderInputs = () => {
    const { fio, address, phone, arrivalDate, arrivalDateVisible, timeFrom, timeTo, arrivalTimeVisible } = this.state;

    return (
      <View>
        {this.props.route?.params?.fromDetails ? null : (
          <TextButton
            title={`Список документов для курьера`}
            onPress={() => this.setState({ documentsModalVisible: true })}
            textSize={TEXT_SIZE_16}
            textColor={Colors.blue}
            style={{ alignSelf: 'center' }}
          />
        )}
        
        <StyledInput
          style={{ marginTop: MARGIN_TOP_MD }}
          value={fio}
          label={`ФИО участника строительства`}
          // onChangeText={(text) => this.setState({ fio: text })}
          onChangeText={(text) => {
            if (isNaN(text.slice(-1)) || text.slice(-1) === ' ' || text.slice(-1) === '') {
              this.setState({ fio: text })
            } else {
              this.setState({ fio: this.state.fio || '' })
            }
          }}
        />
        <StyledInput
          value={address}
          label={`Адрес участника строительства`}
          onChangeText={(text) => this.setState({ address: text })}
        />
        <TextInputMask
          type={'custom'}
          value={phone}
          options={{
            // maskType: 'INTERNATIONAL',
            // withDDD: true,
            mask: '+7 999 999 99 99',
          }}
          innerLabel={`Телефон`}
          onChangeText={(text) => this.setState({ phone: text })}
        />
        <StyledInput
          // type={'datetime'}
          value={arrivalDate
            ? moment(arrivalDate).calendar().split(',').length === 2
              ? (
                `${moment(arrivalDate).calendar().split(',')[0]}, ${moment(arrivalDate).format('LL')}`.length > 30
                  ? `${moment(arrivalDate).format('DD.MM.YYYY')}`
                  : `${moment(arrivalDate).calendar().split(',')[0]}, ${moment(arrivalDate).format('LL')}`
              )
              : moment(arrivalDate).calendar().split(',')[0]
            : null}
          // innerLabel={`Дата приезда курьера`}
          rightIconType={`datePicker`}
          label={`Дата приезда курьера`}
          rightIconPress={() => this.setState({
            arrivalDateVisible: true,
            arrivalDate: arrivalDate || moment().toDate()
          })}
          disabled
        />
        <StyledInput
          keyboardType={`numeric`}
          // selectedItem={arrivalTime}
          value={timeTo ? `${moment(timeFrom).format('HH:mm')} - ${moment(timeTo).format('HH:mm')}` : null}
          label={`Время приезда курьера`}
          rightIconType={`timePicker`}
          // pickerData={apartmentRooms}
          // onItemChange={(value) => this.setState({ selectedRoom: value })}
          disabled
          rightIconPress={() => this.setState({ arrivalTimeVisible: true })}
        />


        <ModalBottom
          visible={arrivalDateVisible}
          type="datePicker"
          title={'Дата приезда курьера'}
          onButtonPress={() => this.setState({ arrivalDateVisible: false })}
          onSwipeOut={() => this.setState({ arrivalDateVisible: false })}
          onDateChange={(date) => this.setState({ arrivalDate: date })}
          date={arrivalDate || null}
          minimumDate={moment().add(1, 'days').toDate()}
        />

        <ModalBottom
          visible={arrivalTimeVisible}
          onSwipeOut={() => this.setState({ arrivalTimeVisible: false })}
          title={'Время приезда курьера'}
          height={'35%'}
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom:  40 }}>
              <DatePicker
                style={{ width: 100, height: 50  }}
                locale={'ru'}
                date={timeFrom}
                mode="time"
                minuteInterval={15}
                onDateChange={(date) => this.setState({ timeFrom: moment(date).toDate() })}
                // minimumDate={new Date()}
                maximumDate={timeTo ? moment(timeTo).toDate() : null}
              />
              <StyledText
                color={'#77767E'}
                size={2.5}
                style={{ marginHorizontal: 20 }}
              >
                До
              </StyledText>
              <DatePicker
                is24hourSource
                style={{ width: 100, height: 50 }}
                locale={'ru'}
                date={timeTo}
                mode="time"
                minuteInterval={15}
                onDateChange={(date) => this.setState({ timeTo: moment(date).toDate() })}
                minimumDate={timeFrom ? moment(timeFrom).add(30, 'minutes').toDate() : null}
              /> 
            </View>
            
            <MainButton
              style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: '100%' }}
              title={'ОK'}
              onPress={() => this.setState({ arrivalTimeVisible: false }, () => {
                setTimeout(() => {
                  this.setState({ arrivalTimeVisible: false })
                }, 100);
              })}
            />
          </View>
          
        </ModalBottom>


        {/** документы для курьера */}
        {/* <ModalBottom
          visible={this.state.documentsModalVisible}
          onSwipeOut={() => this.setState({ documentsModalVisible: false })}
          height={0.9}
        >
          <View style={{ flex: 1 }}>
            <StyledText centered bold size={TEXT_SIZE_16}>
              {`Какие документы вам нужно \nпередать курьеру?`}
            </StyledText>

            <View style={{ height: 15 }} />

            <StyledText centered color={'#666666'} size={TEXT_SIZE_13}>
              {`Подзаголовок модального окна.\nЗанимает две, три строки. `}
            </StyledText>

            <View style={{ width: SCREEN_WIDTH, height: 1, backgroundColor: '#E2E2E2', marginTop: 15 }} />

            <View style={{ height: 15}} />
            <View>
              {this.state.documents.map((document, i) => {

                if (document.id !== 3 && document.id !== 4) {
                  return (
                    <View key={document.id} style={{ paddingLeft: 20, paddingVertical: 10 }}>
                      <View style={{ width: '60%' }}>
                        <StyledText>{document.name}</StyledText>
                        <StyledText size={TEXT_SIZE_11} color={`#666666`}>
                          {document.description}
                        </StyledText>
                      </View>

                      {document.images && document.images.length ? (
                        <View style={{ position: 'absolute', top: 10, right: 20, flexDirection: 'row', alignItems: 'center' }}>
                          <Image source={require('assets/images/icons/ok-green.png')} style={{ width: 9.5, height: 7 }} />
                          <StyledText color={`#59BC48`} style={{ marginLeft: 7 }}>Загружено</StyledText>
                        </View>
                      ) : null}
                    </View>
                  )
                }
                
              })}
            </View>



            <MainButton
              style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: '100%', borderWidth: 0, backgroundColor: 'white' }}
              title={'Ок'}
              onPress={() => this.setState({ documentsModalVisible: false })}
              textStyle={{ color: '#1D5ACB', fontSize: 16 }}
            />
          </View>
        </ModalBottom> */}
      </View>
    )
  }

  // onContinueDocuments = () => {
  //   this.props.navigation.navigate('Signature', { documents: this.state.documents })
  // }

  onContinueCourier = () => {
    const {
      fio,
      address,
      phone,
      arrivalDate,
      timeFrom,
      timeTo
     } = this.state;

     let error = false
     if (!fio.split(' ')[1]) {
      Alert.alert('Ошибка', 'Введите корректные данные в поле ФИО')
      error = true
    }
    if (!arrivalDate) {
      Alert.alert('Ошибка', 'Выберите дату приезда курьера')
      error = true
    }
    if (error) { return }

     if (this.state.documents.length) {
        Api.Services.sendDocuments(this.state.documents)
          .then(res => {
            console.log('documents was successfully sended')
          })
          .catch(err => {
            console.log('documents sending failed:')
            console.log(err)
            // errorHandler(err)
          })
     }
     

    Api.Services.callACourier({
      fio,
      address,
      phone,
      arrivalDate,
      timeFrom: moment(timeFrom).format('HH:mm').toString(),
      timeTo: moment(timeTo).format('HH:mm').toString()
    })
      .then((res: any) => {
        console.log(res)
        // this.props.dispatch(clearPenalty())
        this.setState({ isLoading: true, completeVisible: true }, () => {
          setTimeout(() => {
            this.setState({
              isLoading: false,
            })
          }, 6000);
        })
        
      })
      .catch(err => {
        errorHandler(err)
      })
  }

  getDocumentsComplete = () => {
    const { documents } = this.state;

    let isComplete = true
    documents.map(doc => {
      if (!doc.images.length) {
        isComplete = false
      }
    })

    return isComplete
  }
  getCourierComplete = () => {
    const { fio, address, phone, arrivalDate, timeFrom, timeTo } = this.state;

    return fio && address && phone && arrivalDate && timeFrom && timeTo
  }

  render() {
    const
      { navigation } = this.props,
      { scrollOffset, selectedMethod, completeVisible, isLoading } = this.state;

    return (
      <MainLayout showShadow={scrollOffset > 0} disablePadding>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            backgroundColor: Colors.background,
            paddingHorizontal: PADDING_SIZE,
            paddingBottom: 25,
          }}
          onScroll={this.handleScroll}
          // onKeyboardDidShow={() => this.setState({ hideBottom: true })}
          // onKeyboardDidHide={() => this.setState({ hideBottom: false })}
        >
          <StyledText size={TEXT_SIZE_15} color={Colors.gray} style={{ marginTop: TITLE_TOP }}>Создание заявки. Шаг 4/4</StyledText>
          <StyledText isTitle style={{ marginTop: MARGIN_TOP_SM }}>
            {this.props.route?.params?.fromDetails ? 'Вызов курьера' : 'Подача документов'}
          </StyledText>

          <View style={{  marginTop: MARGIN_TOP_MD }} />
          {this._renderInputs()}

        </KeyboardAwareScrollView>

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.05)']}
          style={{
            height: 20,
            alignItems: 'center',
            width: '100%',
            position: 'absolute',
            bottom: 100
            // top: -20,
            // zIndex: -1
          }}
        />
        <Footer>
          <MainButton
            // disabled={selectedMethod === 0 ? !this.getDocumentsComplete() : !this.getCourierComplete()}
            title={'Вызвать курьера'}
            onPress={() => this.onContinueCourier()}
          />
        </Footer>


        <Modal
          visible={completeVisible}
          animationType={`slide`}
        >
          {isLoading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={Colors.blue} />
            </View>
          ) : (
            <PenaltyCompleteModal
              onClose={() => {
                this.setState({ completeVisible: false }, () => {
                  this.props.dispatch(clearPenalty())
                  navigation.dispatch(StackActions.popToTop());
                })
              }}
              toPersonalArea={() => {
                this.setState({ completeVisible: false }, () => {
                  this.props.dispatch(clearPenalty())

                  navigation.dispatch(StackActions.popToTop());

                  const jumpToAction = DrawerActions.jumpTo('PersonalArea');
                  navigation.dispatch(jumpToAction);
                })
              }}
            />
          )}
          
        </Modal>
      </MainLayout>
    )
  }
}

export default connect(penaltyCreationSelector)(CallACourierScreen)

const Document = styled.View`
  background-color: ${Colors.grayLight};
  width: ${`${SCREEN_WIDTH - ((PADDING_SIZE * 2))}px`};
  border-style: dashed;
  border-width: 1px;
  border-color: rgba(29, 90, 203, 0.3);
  min-height: 160px;
  padding: 20px;
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  min-height: 200px;
`

const Footer = styled.View`
  width: 100%;
  height: 100px;
  align-items: center;
  justify-content: center;
  position: relative;
  bottom: 0;
  background-color: white;
  padding-horizontal: 20px;
`;

const ItemFooter = styled.View`
  width: 100%;
  position: absolute;
  bottom: 20px;
  flex-direction: row;
  justify-content: space-between;
  left: 20px;
`