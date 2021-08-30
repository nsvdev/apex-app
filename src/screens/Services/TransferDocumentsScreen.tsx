import React from 'react';
import { FlatList, Text, View, Image, Modal, Alert } from 'react-native';
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
import { num2str, errorHandler } from 'utils';
import moment from 'moment';
import DatePicker from 'react-native-date-picker'
import { clearPenalty } from 'redux/actions'
import Api from 'api';
import PenaltyCompleteModal from './PenaltyCompleteModal'
import { StackActions } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { setUser } from 'redux/actions/user';

interface Props {
  dispatch
  navigation
  penalty: IPenaltyAppilationStore
  route : {
    params: {
      gosUslugi: boolean
    }
  }
}

var initTimeFrom = moment();
initTimeFrom.set({ minute:0, second:0, millisecond:0 });

class TransferDocumentsScreen extends React.Component<Props> {

  state = {
    scrollOffset: 0,
    selectedMethod: 0,
    documents: [
      {
        id: 1,
        name: '1. Скан договора',
        title: 'Сфотографируйте все страницы ДДУ',
        description: '',
        images: !__DEV__ ? [] : [
          {
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvHu3vuPi_dVRe4CsZA_AJGerpWnQweN6UvQPdJYFtYe6Epvxq&usqp=CAU'
          }
        ]
      },
      {
        id: 2,
        name: '2. Скан квитанции или платежного поручения',
        title: 'Сфотографируйте квитанцию или платежное поручение ',
        description: '(доказательство оплаты по договору долевого участия)',
        images: !__DEV__ ? [] : [
          {
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvHu3vuPi_dVRe4CsZA_AJGerpWnQweN6UvQPdJYFtYe6Epvxq&usqp=CAU'
          },
          {
            uri: 'https://lh3.googleusercontent.com/proxy/OAjWtViqRWmE9GSvCueR4eO_egIe375S7YRWxXu_1aXzx8KZMWOSxojc1ALSAUouOg81wzSHQLivL8fw_GfN5xuENqWu5DJBtwDsLpS8ldOtxLdHtoLVmQDE5dbMA3hqsSPtc9FA8eut_iQyhDxCiYEKQFQkQ-fpmQU5rT6FFQg'
          }
        ]
      },
      {
        id: 3,
        name: '3. Скан почтовой квитанции',
        title: 'Сфотографируйте скан почтовой квитанции',
        description: '(доказательство отправки претензии)',
        images: !__DEV__ ? [] : [
          {
            uri: 'https://lh3.googleusercontent.com/proxy/iS3SqRYit_y58zi_4-lkmU8VIbMlTF1_KZ1lX7CfeywSYVMJ0mqc5FtJN5wZ7Qn7G14Vd_tRyi_HuCE4IWlwafh4K5VwqLflLi-JCSQbtTtXxPwmez0JwlTmQdbbexCIibz4WpAiMLizPqiLvVCSkzkVqiMb1TgkstWIduQRWI4'
          }
        ]
      },
      {
        id: 4,
        name: '4. Скан квитанции или платежка об уплате пошлины',
        title: 'Сфотографируйте квитанцию или платежное поручение ',
        description: '(если сумма иска больше 1млн)',
        images: !__DEV__ ? [] : [
          {
            uri: 'https://lh3.googleusercontent.com/proxy/iS3SqRYit_y58zi_4-lkmU8VIbMlTF1_KZ1lX7CfeywSYVMJ0mqc5FtJN5wZ7Qn7G14Vd_tRyi_HuCE4IWlwafh4K5VwqLflLi-JCSQbtTtXxPwmez0JwlTmQdbbexCIibz4WpAiMLizPqiLvVCSkzkVqiMb1TgkstWIduQRWI4'
          }
        ]
      },
      {
        id: 5,
        name: '5. Скан паспорта',
        title: 'Сфотографируйте страницу паспорта с фотографией',
        description: '(одна страница)',
        images: !__DEV__ ? [] : [
          {
            uri: 'https://lh3.googleusercontent.com/proxy/iS3SqRYit_y58zi_4-lkmU8VIbMlTF1_KZ1lX7CfeywSYVMJ0mqc5FtJN5wZ7Qn7G14Vd_tRyi_HuCE4IWlwafh4K5VwqLflLi-JCSQbtTtXxPwmez0JwlTmQdbbexCIibz4WpAiMLizPqiLvVCSkzkVqiMb1TgkstWIduQRWI4'
          }
        ]
      }
    ],
    fio: this.props.penalty.fullName,
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
    setTimeout(() => {
      if (__DEV__) {
        this.setState({
          fio: this.props.penalty.fullName,
          address: "Адрес 11",
          phone: '+79992344333',
          arrivalDate: moment().add(1, "days").toDate(),
          // timeTo: initTimeFrom.add(1, 'hours') .toDate(),
        })
      }
    }, 1000);
  }

  removeImages = (index) => {
    const documents = this.state.documents
    documents[index].images = []
    this.setState({ documents })
  }

  setImages = (index, images) => {
    const documents = this.state.documents
    documents[index].images = images
    this.setState({ documents })
  }

  handleScroll = ({ nativeEvent }) => {
    this.setState({ scrollOffset: nativeEvent.contentOffset.y })
  }

  _renderDocuments = () => {
    const
      { navigation } = this.props,
      { documents } = this.state;

    return (
      <View>
        <StyledText size={TEXT_SIZE_14} color={Colors.grayDark} style={{ width: '90%' }}>
        Для подачи иска необходимо приложить 
к заявлению сканы документов. Вы можете загрузить файлы или сфотографировать 
их на телефон.
        </StyledText>

        <View style={{  marginTop: MARGIN_TOP_LG }} />
        {documents.map((item, index) => (
          <Document key={index}>
            <StyledText bold size={TEXT_SIZE_14} style={{ width: '60%' }}>
              {item.name}
            </StyledText>
            <StyledText size={TEXT_SIZE_11} color={Colors.grayDark} style={{ width: '80%', marginTop: 6 }}>
              {item.description}
            </StyledText>

            {item.images.length ? (
              <Image
                source={{ uri: item.images[item.images.length - 1].uri }}
                style={{ width: 50, height: 50, position: 'absolute', right: 20, top: 20, borderRadius: 5 }}
              />
            ) : null}

            <ItemFooter>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.images.length ? (
                  <Image
                    source={require('assets/images/icons/plus-blue.png')}
                    style={{ width: 11, height: 11, marginRight: 8 }}
                  />
                ) : null}

                <TextButton
                  title={`Добавить`}
                  onPress={() => navigation.navigate('Camera', {
                    documentID: item.id,
                    title: item.title,
                    images: item.images,
                    setImages: (images) => this.setImages(index, images)
                  })}
                  textColor={Colors.blue}
                />
              </View>
              

              {item.images.length ? (
                <View style={{ flexDirection: 'row' }}>
                  <StyledText size={TEXT_SIZE_14} color={Colors.gray}>
                    {`${item.images.length} ${num2str(item.images.length, ['лист', 'листа', 'листов'])}`}
                  </StyledText>

                  <TouchableOpacity
                    style={{ width: 14, height: 18, marginLeft: 10 }}
                    onPress={() => this.removeImages(index)}
                  >
                    <Image
                      source={require('assets/images/icons/trash-gray.png')}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </TouchableOpacity>
                  
                </View>
                
              ) : null}
              
            </ItemFooter>
            
          </Document>
        ))}

      </View>
    )
  }

  _renderInputs = () => {
    const { fio, address, phone, arrivalDate, arrivalDateVisible, timeFrom, timeTo, arrivalTimeVisible } = this.state;

    return (
      <View>
        <TextButton
          title={`Список документов для курьера`}
          onPress={() => this.setState({ documentsModalVisible: true })}
          textSize={TEXT_SIZE_16}
          textColor={Colors.blue}
          style={{ alignSelf: 'center' }}
        />

        <StyledInput
          style={{ marginTop: MARGIN_TOP_MD }}
          value={fio}
          label={`ФИО участника строительства`}
          onChangeText={(text) => this.setState({ fio: text })}
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
            mask: '8 999 999 99 99',
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
          minimumDate={moment().subtract(1, 'hours').toDate()}
        />

        <ModalBottom
          visible={arrivalTimeVisible}
          onSwipeOut={() => this.setState({ arrivalTimeVisible: false })}
          title={'Время приезда курьера'}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', paddingTop: '7%', alignItems: 'center' }}>
              <DatePicker
                style={{ width: 100  }}
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
                style={{ width: 100 }}
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
              onPress={() => this.setState({ arrivalTimeVisible: false })}
            />
          </View>
          
        </ModalBottom>


        {/** документы для курьера */}
        <ModalBottom
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
              {this.state.documents.map((document, i) => (
                <View key={document.id} style={{ paddingLeft: 20, paddingVertical: 10 }}>
                  {/* {i === 2 ? <View style={{ height: 20 }} /> : null} */}
                  <View style={{ width: '60%' }}>
                    <StyledText>{document.name}</StyledText>
                    <StyledText size={TEXT_SIZE_11} color={`#666666`}>
                      {document.description}
                    </StyledText>
                  </View>

                  {document.images.length ? (
                    <View style={{ position: 'absolute', top: 10, right: 20, flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={require('assets/images/icons/ok-green.png')} style={{ width: 9.5, height: 7 }} />
                      <StyledText color={`#59BC48`} style={{ marginLeft: 7 }}>Загружено</StyledText>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
            


            <MainButton
              style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: '100%', borderWidth: 0, backgroundColor: 'white' }}
              title={'Ок. Я понял'}
              onPress={() => this.setState({ documentsModalVisible: false })}
              textStyle={{ color: '#1D5ACB', fontSize: 16 }}
            />
          </View>
        </ModalBottom>
      </View>
    )
  }

  onContinueDocuments = () => {
    // this.props.navigation.navigate('Signature', { documents: this.state.documents })
    
    // this.setState({ completeVisible: true })
    // return
    this.setState({ isLoading: true })

    let err = false
    this.state.documents.map(d => {
      if (d.images.length === 0) {
        err = true
      }
    })

    if (err) {
      // this.setState({ completeVisible: true })
      // return
    }

    Api.Services.sendDocuments(this.state.documents)
          .then(res => {
            console.log('documents was successfully sended')

            this.props.dispatch(setUser({
              name: null,
              lastName: null,
              middleName: null,
            }))

            this.setState({ completeVisible: true, isLoading: false })
          })
          .catch(err => {
            this.setState({ isLoading: false })
            console.log('documents sending failed:')
            errorHandler(err)
          })
  }

  onContinueCourier = () => {
    const {
      fio,
      address,
      phone,
      arrivalDate,
      timeFrom,
      timeTo
     } = this.state;

    if (!this.props.route.params?.gosUslugi) {
      this.props.navigation.navigate('CallACourier', { documents: this.state.documents })
      return
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
        // this.props.dispatch(clearPenalty())
        this.setState({ completeVisible: true })
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
      { scrollOffset, selectedMethod, completeVisible } = this.state;

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
          <StyledText size={TEXT_SIZE_15} color={Colors.gray} style={{ marginTop: TITLE_TOP }}>Создание заявки. Шаг 3/4</StyledText>
          <StyledText isTitle style={{ marginTop: MARGIN_TOP_SM }}>Подача документов</StyledText>

          {/* {this.props.route.params?.gosUslugi ? (
            <View>
              <View style={{  marginTop: MARGIN_TOP_LG }} />

              <ButtonGroup
                buttons={['Загрузить сканы', 'Доверить оформление курьеру']}
                selectedIndex={selectedMethod}
                onSelectIndex={(i) => this.setState({ selectedMethod: i})}
                buttonStyle={selectedMethod === 0
                  ? {
                    width:  '120%',
                    left: '-20%'
                  }
                  : {
                    width: '80%',
                    left: 0
                  }}
                selectedButtonStyle={selectedMethod === 0
                  ? {
                    width: '80%',
                    left: 0
                  }
                  : {
                    width:  '120%',
                    left: '-20%'
                  }}
              />
            </View>
           
          ) : null} */}
          

          <View style={{  marginTop: MARGIN_TOP_MD }} />
          {selectedMethod === 0
            ? this._renderDocuments()
            : this._renderInputs()}

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
            isLoading={this.state.isLoading}
            // disabled={selectedMethod === 0 ? !this.getDocumentsComplete() : !this.getCourierComplete()}
            title={selectedMethod === 0 ? `Далее` : 'Вызвать курьера'}
            // onPress={() => selectedMethod === 0 && this.props.route.params?.gosUslugi
            //   ? this.onContinueDocuments()
            //   : this.onContinueCourier()}
            onPress={() => this.onContinueDocuments()}
          />
        </Footer>


        <Modal
          visible={completeVisible}
          animationType={`slide`}
        >
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
        </Modal>
      </MainLayout>
    )
  }
}

export default connect(penaltyCreationSelector)(TransferDocumentsScreen)

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