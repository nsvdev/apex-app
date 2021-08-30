import React from 'react';
import {
  FlatList,
  Text,
  View,
  Dimensions,
  Alert,
  Image,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import styled from 'styled-components/native';
import {
  MainLayout,
  StyledText,
  StyledInput,
  TextInputMask,
  ModalBottom,
  CheckBox,
  MainButton
} from 'components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  TITLE_TOP,
  DESCRIPTION_TOP,
  Colors,
  MARGIN_TOP_MD,
  TEXT_SIZE_11,
  TEXT_SIZE_13,
  TEXT_SIZE_14,
  TEXT_SIZE_15,
  PADDING_SIZE,
  MARGIN_TOP_SM,
  MARGIN_TOP_LG,
  TEXT_SIZE_16,
  SCREEN_HEIGHT
} from '../../constants';
import { connect } from 'react-redux'
import { penaltyCreationSelector } from 'redux/selectors';
import moment from 'moment';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import { num2str, checkIsEmptyString, isIos } from 'utils'
import * as Progress from 'react-native-progress';
import { setPenalty, updatePenalty } from 'redux/actions'
import { TextMask } from 'react-native-masked-text'
import Api from 'api'
import { optionsWithBack, backStyle } from 'navigation/navigationOptions';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { setUser } from 'redux/actions/user';

interface Props {
  services: IServicesStore
  dispatch
  navigation
  penalty: IPenaltyAppilationStore,
  route,
  hideKeyboard: boolean
  user: IUser
}

const hintTitle = 'Внимание!'
const hintDescription = 'В соответствии с постановлением Правительства № 423 от 2 апреля 2020 г. в период с 03 апреля 2020 г. по 01 января 2021 г. неустойка за неисполнение обязательств застройщиком не начисляется в связи с развитием коронавирусной инфекции (Covid-2019). При расчете размера неустойки застройщика положения данного нормативного акта учтены.'

class PenaltyCreationScreen extends React.Component<Props> {

  state = {
    hideKeyboard: false,
    dateEnd: null,

    scrollOffset: 0,
    fio: null,
    address: null,
    contractDate: null,// this.props.penalty.conclusionDate || null,
    contractDateVisible: false,
    transferDate: null,
    transferDateVisible: false,
    builderInn: null,
    ddu: null,
    builderName: null,
    builderAddress: null,
    apartmentAddress: null,
    apartmentPrice: null,
    apartmentRooms: Array.from(Array(16), (itm, i) => { if (i) { return `${i}` }}).filter(Boolean),
    selectedRoom: null,
    apartmentArea: null,
    buildingFloors: Array.from(Array(99), (itm, i) => { if (i) { return `${i}` }}).filter(Boolean),
    buildingFloorNumber: null,
    requisites: 0, // 0 \ 1
    conditionsAgree: false,
    progress: 0,
    selectedFloor: null,
    floors: Array.from(Array(99), (itm, i) => { if (i) { return `${i}` }}).filter(Boolean),

    editingData: {
      bankData: {
        bik: null,
        bankAccountNumber: null,
        receiverFio: null,
      },
      cardData: {
        valid: false,
        cvc: null,
        expiry: null,
        number: null,
        receiverFio: null
      },
      sum: {
        forfeit: 0,
        penalty: 0,
        commission: 0
      },
      additionalSum: []
    },

    editedSum: null,

    cardChanging: false
  }

  componentDidMount() {
    const { penalty, route, navigation, user } = this.props,
    editing = route.params?.editing ? true : false;

    if (editing) {
      const applicationId = route.params.application.id;
      this.fetchData(applicationId)
    }
    
    if (__DEV__ && !editing) {
      this.setFakeData()
    }

    this.setState({
      // fio: user.name ? `${user.name} ${user.middleName} ${user.lastName}` : '',
      apartmentPrice: this.props.penalty.housePrice,

      // contractDate: this.props.penalty.conclusionDate,
      dateEnd: this.props.penalty.conclusionDate,// 
      transferDate: this.props.penalty.transferDate
    })

    BackHandler.addEventListener('hardwareBackPress', this.hideModal)
  }

  hideModal = () => {
    setTimeout(() => {
      this.setState({
        contractDateVisible: false,
        transferDateVisible: false,
        
      })
    }, 100);
    return this.state.contractDateVisible
    || this.state.transferDateVisible
    // || this.state.transferDateVisible
      ? true : false
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.hideModal)
  }

  setFakeData = () => {
    const user = this.props.user
    setTimeout(() => {
      this.setState({
        fio: 'Фамилия Имя Отчество',
        address: 'ул.Аддрес 33',
        contractDate: '22.08.2018',
        // transferDate: '12.11.2018',
        builderInn: '7706660298',
        // ddu: '3533563446364364',
        builderName: 'ООО Название',
        builderAddress: 'ул. Улица 22',
        apartmentAddress: 'ул. Улица 65',
        apartmentPrice: this.props.penalty.housePrice,
        selectedRoom: 1,
        apartmentArea: '85,5',
        buildingFloorNumber: 1,
        conditionsAgree: false,
        selectedFloor: 1,
      })
    }, 1000);
  }

  fetchData = async (applicationId) => {
    const result = await  Api.PersonalArea.getApplicationForEdit(applicationId)
    const data = result.data.data

    this.setState({
      fio: data.application.applicant.full_name,
      address: data.application.applicant.building_address,
      contractDate: moment(data.application.contract.conclusion_date, 'YYYY-MM-DD').format('DD.MM.YYYY').toString(),
      transferDate: moment(data.application.contract.transfer_date, 'YYYY-MM-DD').format('DD.MM.YYYY').toString(),
      builderInn: data.application.developer.inn,
      ddu: data.application.contract.ddu,
      builderName: data.application.developer.developer_name,
      builderAddress: data.application.developer.developer_address,
      apartmentAddress: data.application.house.house_address,
      apartmentPrice: String(data.application.house.house_price).split('.').length > 1 ? String(data.application.house.house_price).split('.')[0] : data.application.house.house_price,
      selectedRoom: Number(data.application.house.room_count) - 1,
      apartmentArea: String(data.application.house.area),
      // buildingFloorNumber: Number(data.application.house.number_storeys) - 1,
      selectedFloor: Number(data.application.house.floor) - 1,
      editingData: {
        bankData: {
          bik: data.bank_transfer ? String(data.bank_transfer.bic) : null,
          bankAccountNumber: data.bank_transfer ? String(data.bank_transfer.account_number) : null,
          receiverFio: data.bank_transfer ? data.bank_transfer.name_recipient : null,
        },
        cardData: {
          valid: true,
          cvc: data.credit_card ? data.credit_card.code : null,
          expiry:  data.credit_card ? data.credit_card.validity : null,
          number:  data.credit_card ? data.credit_card.card_number : null,
          receiverFio:  data.credit_card ? data.credit_card.owner_name : null
        },
        sum: {
          forfeit: String(data.sum.forfeit).split('.').length > 1 ? String(data.sum.forfeit).split('.')[0] : data.sum.forfeit,
          penalty: String(data.sum.penalty).split('.').length > 1 ? String(data.sum.penalty).split('.')[0] : String(data.sum.penalty),
          commission: String(data.sum.commission).split('.').length > 1 ? String(data.sum.commission).split('.')[0] : String(data.sum.commission)
        },
        additionalSum: data.application.additional_sum || [],
      },
      requisites: data.credit_card ? (data.credit_card.card_number ? 1 : 0) : 0

    }, () => console.log('this.state.editingData.cardData'))
  }

  handleScroll = ({ nativeEvent }) => {
    this.setState({ scrollOffset: nativeEvent.contentOffset.y })

    if (nativeEvent.contentOffset.y > 30) {
      this.props.navigation.setOptions({
        headerBackImage: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              resizeMode="contain"
              source={require('assets/images/back.png')}
              style={backStyle}
            />
          </View>
        ),
        headerTitle: () => (
          <View style={{ left: isIos ? 0 : '0%', alignItems: 'center' }}>
            <StyledText bold size={TEXT_SIZE_16}>Ввод данных</StyledText>
            <StyledText>Создание заявки. шаг 1 из 4</StyledText>
          </View>
        )
      })
    } else {
      this.props.navigation.setOptions({
        ...optionsWithBack(this.props),
        headerTitle: false
      })
    }

    
   }

  _renderBankInputs = () => {
    const
      { editingData } = this.state,
      { bik, bankAccountNumber, receiverFio } = editingData.bankData;

    return (
      <View>
        <TextInputMask
          type={'custom'}
          options={{
            mask: '999999999',
          }}
          value={bik}
          innerLabel={`БИК Банка`}
          onChangeText={(text) => this.setState({
            editingData: {
              ...editingData,
              bankData: {
                ...editingData.bankData,
                bik: text
              }
            }
          }, () => console.log('editingData.bankData.bik'))}
        />
        <TextInputMask
          type={'custom'}
          options={{
            mask: '9999999999999999999999'
          }}
          value={bankAccountNumber}
          innerLabel={`Номер счета`}
          onChangeText={(text) => this.setState({
            editingData: {
              ...editingData,
              bankData: {
                ...editingData.bankData,
                bankAccountNumber: text
              }
            }
          })}
        />
        <StyledInput
          value={receiverFio}
          label={`ФИО получателя`}
          autoCapitalize={'words'}
          onChangeText={(text) => {
            let t = ''
            if (isNaN(text.slice(-1)) || text.slice(-1) === ' ' || text.slice(-1) === '') {
              t = text
            } else {
              t = this.state.editingData.bankData.receiverFio || ''
            }

            this.setState({
              editingData: {
                ...editingData,
                bankData: {
                  ...editingData.bankData,
                  receiverFio: t
                }
              }
            })}
          }
        />
      </View>
    )
  }

  onCardChange = (form) => {
    this.setState({
      editingData: {
        ...this.state.editingData,
        cardData: {
          ...form.values,
          valid: form.valid,
          receiverFio: this.state.editingData.cardData.receiverFio
        }
      }
    })
  }

  _renderCardInputs = () => {
    const { cardData } = this.state.editingData

    return (
      <View>
        {!this.state.cardChanging ? (
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
            <StyledText
              style={{ marginLeft: 10 }}
            >
              {cardData.number}
            </StyledText>

            <StyledText
              style={{ marginLeft: 10 }}
              onPress={() => this.setState({ cardChanging: true })}
              color={Colors.blue}
            >
              Изменить
            </StyledText>
          </View>
        ) : (
          <View>
            <LiteCreditCardInput
              onChange={this.onCardChange}
            />
            <StyledInput
              containerBackground={'white'}
              containerStyle={{ paddingLeft: 12 }}
              value={this.state.editingData.cardData.receiverFio}
              label={`Владелец карты`}
              // onChangeText={(text) => this.setState({ bankData: {
              //   ...bankData,
              //   receiverFio: text
              // }})}
              autoCapitalize={'words'}
              onChangeText={(text) => {
                let t = ''
                if (isNaN(text.slice(-1)) || text.slice(-1) === ' ' || text.slice(-1) === '') {
                  t = text
                } else {
                  t = this.state.editingData.cardData.receiverFio || ''
                }

                this.setState({
                  editingData: {
                    ...this.state.editingData,
                    cardData: {
                      ...this.state.editingData.cardData,
                      receiverFio: t
                    }
                  }}
                )}
              }
            />
          </View>
          
        )}
        
        
      </View>
    )
  }

  getComplete = () => {
    const { penalty, route } = this.props,
    editing = route.params?.editing ? true : false,
    {
      scrollOffset,
      contractDateVisible,
      transferDateVisible,
      buildingFloors,
      apartmentRooms,
      floors,
      progress,
      requisites,
      conditionsAgree,
      ddu,
      editingData,
      hideKeyboard,
      buildingFloorNumber,
      editedSum,
      dateEnd,
      ...inputs
    } = this.state

    const checkingData = editing ? {...inputs, ...requisites === 0 ?
      editingData.bankData
      : editingData.cardData
    } : inputs

    let completedMax = Object.keys(checkingData).length // число для 100% заполнения прогресс бара
    let completed = 0.0
    for (const key in checkingData) {
      if (checkingData.hasOwnProperty(key)) {
        const element = checkingData[key];
        if (element !== null && element !== false && !checkIsEmptyString(element)) { completed += 1 }
      }
    }

    let progressPercent = (completed * 100) / completedMax
    progressPercent = Math.floor(progressPercent)

    return progressPercent / 100
  }

  getErrorMsg = (fieldName, isSpecialCharacter) => {
    let msg = ''

    switch (fieldName) {
      case 'fio':
        msg = 'Введите данные в поле ФИО'
        break;
      case 'address':
        msg = 'Заполните адрес участника строительства'
        break;
      case 'contractDate':
        msg = 'Введите дату заключения договора'
        break;
      case 'transferDate':
        msg = 'Введите дату до наступления которой должна быть передана квартира'
        break;
      case 'builderInn':
        msg = 'Введите ИНН застройщика'
        break;
      case 'builderName':
        msg = 'Введите наименование застройщика'
        break;
      case 'builderAddress':
        msg = 'Введите адрес застройщика'
        break;
      case 'apartmentAddress':
        msg = 'Введите адрес квартиры'
        break;
      case 'selectedRoom':
        msg = 'Введите кол-во комнат'
        break;
      case 'apartmentArea':
        msg = 'Введите общую площадь'
        break;
      case 'selectedFloor':
        msg = 'Введите этаж'
        break;
      case 'apartmentPrice':
        msg = 'Введите цену квартиры (договора)'
        break;
    
      default:
        msg = ''
        break;
    }

    if (isSpecialCharacter && (
      fieldName == 'address'
      || fieldName == 'builderAddress'
    )) {
      msg = ''
    }

    console.log(msg)

    if (isSpecialCharacter && msg.length > 0) {
      return `Корректно ${msg}`
    } else {
      return msg
    }
  }

  strIsValid(str){
    return !/[~`!#$%\^&*+=\-▲♦♥☼\[\]\\';,/{}|\\":<>\?]/g.test(str);
    // console.log(str)
    // return !(/^[a-z0-9]+$/i.test(str));
  }

  strIsValidFio(str){
    return /^[а-яА-Я ]*$/.test(str);
  }

  onContinue = async () => {
    const { dispatch, navigation, route } = this.props
    const {
      scrollOffset,
      contractDateVisible,
      transferDateVisible,
      buildingFloors,
      apartmentRooms,
      floors,
      progress,
      requisites,
      conditionsAgree,
      hideKeyboard,
      buildingFloorNumber,
      ddu,
      editedSum,
      editingData,
      dateEnd,
      apartmentAddress,
      apartmentArea,
      ...inputs
    } = this.state;

    let error = false
    for (const key in inputs) {
      if (inputs.hasOwnProperty(key)) {
        const element = inputs[key];

        if (key === 'fio') {
          if (!this.state.fio.split(' ')[1]) {
            Alert.alert('Ошибка', 'Введите корректные данные в поле ФИО')
            error = true
            return
          }
        }

        if (key === 'fio') {
          if (!this.state.fio.split(' ')[2]) {
            Alert.alert('Ошибка', 'Введите корректные данные в поле ФИО')
            error = true
            return
          }
        }

        let fioError = false
        if (key === 'fio') {
          const valid = this.strIsValidFio(element)

          if (!valid) {
            fioError = true
          }

          this.state.fio.split(' ').map(itm => {
            if (itm.length < 2 && itm.length > 0) {
              fioError = true
            }
          })
        }

        if (element === null
          || element === ''
          || !this.strIsValid(element)
          || fioError
          ) {
          let msg = this.getErrorMsg(key, !this.strIsValid(element) || fioError)

          if (msg.length > 0) {
            Alert.alert('Ошибка', msg)
            error = true
            break
          }
        }
      }
    }

    // if (!this.state.fio.split(' ')[1]) {
    //   Alert.alert('Ошибка', 'Введите корректные данные в поле ФИО')
    //   error = true
    // }

    if (error) { return }

    const { transferDate, apartmentPrice } = this.state;
    // const conclusionDate = this.props.penalty.conclusionDate

    // console.log(dateStart)
    // console.log(transferDate)

    try {
      const result: any = await Api.Services.calcultePenalty({
        cost: Number(apartmentPrice.replace(/ /g,'')),
        dateStart: this.state.transferDate, // this.state.contractDate,
        dateEnd:  this.state.dateEnd// moment(transferDate, 'DD.MM.YYYY').format('YYYY-MM-DD')
      })

      if (result.success) {
        let cost = result.data

        this.props.dispatch(setPenalty({
          receiveAmount: cost || '0',
        }))
      }
    } catch (err) {
      console.log(err)
    }

    let area = apartmentArea
    if (area.includes(',')) {
      area = area.split(',').join('.')
    }
    
    dispatch(setPenalty({
      fullName: inputs.fio,
      buildingAddress: inputs.address,
      // ddu: !checkIsEmptyString(ddu) ? ddu : null,
      ddu: ddu || null,
      conclusionDate: moment(inputs.contractDate, 'DD.MM.YYYY').format('YYYY-MM-DD').toString(),
      transferDate: moment(inputs.transferDate, 'DD.MM.YYYY').format('YYYY-MM-DD').toString(),
      inn: inputs.builderInn || null,
      developerName: inputs.builderName,
      developerAddress: inputs.builderAddress,
      houseAddress: apartmentAddress,
      roomCount: inputs.selectedRoom + 1,
      // area: area.replace(/ /g,''),
      area,
      floor: inputs.selectedFloor + 1,
      // numberStoreys: inputs.buildingFloorNumber + 1,
      housePrice: inputs.apartmentPrice,

      additionalSum: this.state.editingData.additionalSum,
      hintTitle,
      hintDescription
    }))

    dispatch(setUser({
      name: inputs.fio.split(' ')[1],
      lastName: inputs.fio.split(' ')[0],
      middleName: inputs.fio.split(' ')[2],
    }))

    BackHandler.removeEventListener('hardwareBackPress', this.hideModal)
    
    if (route.name === 'PenaltyEdit') {
      navigation.navigate('PenaltyEdit2')
    } else {
      navigation.navigate('PenaltyCreation2')
    }
  }

  onSave = () => {
    const { dispatch, navigation, route } = this.props
    const {
      scrollOffset,
      contractDateVisible,
      transferDateVisible,
      buildingFloors,
      apartmentRooms,
      floors,
      progress,
      requisites,
      conditionsAgree,
      editingData,
      buildingFloorNumber,
      ddu,
      editedSum,
      dateEnd,
      apartmentAddress,
      apartmentArea,
      ...inputs
    } = this.state;
    const applicationId = route.params.application.id;

    let error = false
    for (const key in inputs) {
      if (inputs.hasOwnProperty(key)) {
        const element = inputs[key];

        let fioError = false
        if (key === 'fio') {
          const valid = this.strIsValidFio(element)
          if (!valid) {
            fioError = true
          }
          
          this.state.fio.split(' ').map(itm => {
            if (itm.length < 2 && itm.length > 0) {
              fioError = true
            }
          })
        }

        if (element === null
          || element === ''
          || !this.strIsValid(element)
          || fioError
          ) {
          let msg = this.getErrorMsg(key, !this.strIsValid(element) || fioError)

          if (msg.length > 0) {
            Alert.alert('Ошибка', msg)
            error = true
            break
          }
        }
      }
    }

    // if (!this.state.fio.split(' ')[1]) {
    //   Alert.alert('Ошибка', 'Введите корректные данные в поле ФИО')
    //   error = true
    // }

    if (error) { return }

    let area = apartmentArea
    if (area.includes(',')) {
      area = area.split(',').join('.')
    }
    
    dispatch(updatePenalty(applicationId, {
      fullName: inputs.fio,
      buildingAddress: inputs.address,
      // ddu: !checkIsEmptyString(ddu) ? ddu : null,
      ddu: ddu || null,
      conclusionDate: moment(inputs.contractDate, 'DD.MM.YYYY').format('YYYY-MM-DD').toString(),
      transferDate: moment(inputs.transferDate, 'DD.MM.YYYY').format('YYYY-MM-DD').toString(),
      inn: inputs.builderInn || null,
      developerName: inputs.builderName,
      developerAddress: inputs.builderAddress,
      houseAddress: apartmentAddress,
      roomCount: inputs.selectedRoom + 1,
      // area: area.replace(/ /g,''),
      area,
      floor: inputs.selectedFloor + 1,
      numberStoreys: '0', // inputs.buildingFloorNumber + 1,
      housePrice: inputs.apartmentPrice.replace(/ /g,''),
      sum: this.state.editedSum || editingData.sum.forfeit, // route.params.sum || 0
    }, navigation, () => route.params.onSave()))

    // реквизиты
    if (this.state.requisites === 0) {
      if (editingData.bankData.bik) {
        Api.Services.updatePenalty(applicationId, {
          bankData: editingData.bankData
        }, true)
      }
    } else {
      Api.Services.updatePenalty(applicationId, {
        bankData: {bik: null},
        cardData: editingData.cardData
      }, true)
    }
    
  }

  _renderBlueBox = (title, description, price, incomplete?: boolean) => (
    <BlueBox style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View>
        <StyledText size={TEXT_SIZE_11} color={Colors.grayDark}>{title}</StyledText>
        <StyledText size={TEXT_SIZE_13}>{description}</StyledText>
        {incomplete ? <StyledText color={'#FF3B30'} size={TEXT_SIZE_11}>Загрузите документы</StyledText> : null}
      </View>

      <View>
        <StyledText></StyledText>
        <StyledText size={TEXT_SIZE_16} color={incomplete ? '#C7CCCF' : Colors.black}>
          <TextMask
            value={price}
            type={'money'}
            options={{
              precision: 0,
              separator: null,
              delimiter: ' ',
              unit: null,
              suffixUnit: null
            }}
          />
          {' '}
          ₽
        </StyledText>
      </View>
      
    </BlueBox>
  )

  onChangeTrigger = async () => {
    const { transferDate, apartmentPrice } = this.state;
    // const conclusionDate = this.state.contractDate ? moment(this.state.contractDate, 'DD.MM.YYYY').format('YYYY-MM-DD') : null

    // console.log(this.state.transferDate)
    // console.log(this.state.dateEnd)

    try {
      const result: any = await Api.Services.calcultePenalty({
        cost: Number(apartmentPrice.replace(/ /g,'')),
        dateStart: this.state.transferDate, // this.state.contractDate,
        dateEnd:  this.state.dateEnd// moment(transferDate, 'DD.MM.YYYY').format('YYYY-MM-DD')
      })

      if (result.success) {
        let cost = result.data

        this.props.dispatch(setPenalty({
          receiveAmount: cost || '0',
        }))
        this.setState({
          editedSum: cost || '0'
        })
        
      }
    } catch (err) {

    }
  }

  getBuilderByInn = async (inn) => {
    const result = await Api.Services.getBuilderByInn(inn.replace(/\s/g, ''))

    if (result.data.success) {
      this.setState({
        builderName: result.data.data.name,
        builderAddress: result.data.data.address
      })
    } else {
      this.setState({
        builderName: '',
        builderAddress: ''
      })
    }
  }

  onChangeInn = (text) => {
    if (text.replace(/\s/g, '').length > 10) { return }
    this.setState({ builderInn: text })

    if (text.replace(/\s/g, '').length == 10) {
      this.getBuilderByInn(text)
    } else {
      this.setState({
        builderName: '',
        builderAddress: ''
      })
    }
  }

  render() {
    const { penalty, route, navigation } = this.props,
    editing = route.params?.editing ? true : false,
    addition = route.params?.addition ? true : false,
    {
      scrollOffset,
      fio,
      address,
      contractDate,
      contractDateVisible,
      transferDate,
      transferDateVisible,
      builderInn,
      ddu,
      builderName,
      builderAddress,
      apartmentAddress,
      apartmentPrice,
      apartmentRooms,
      apartmentArea,
      buildingFloors,
      buildingFloorNumber,
      requisites,
      conditionsAgree,
      progress,
      selectedRoom,
      selectedFloor,
      floors,
      editingData
    } = this.state;

    return (
      <MainLayout
        // style={{ height: 1000 }}
        showShadow={scrollOffset > 0}
        disablePadding
      >
        <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView  
          style={{ backgroundColor: Colors.background, flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: PADDING_SIZE,
            backgroundColor: Colors.background,
            paddingBottom: PADDING_SIZE,
            // flex: 1
            // paddingBottom: PADDING_SIZE,
          }}
          onScroll={this.handleScroll}
          onKeyboardDidShow={() => this.setState({ hideKeyboard: true })}
          onKeyboardDidHide={() => this.setState({ hideKeyboard: false })}
          enableOnAndroid={false}
          // extraHeight={150}
        >
          <View style={{  }}>
            <StyledText size={TEXT_SIZE_15} color={Colors.gray} style={{ marginTop: TITLE_TOP }}>
              {editing ? 'Редактирование заявки' : 'Создание заявки. Шаг 1/4'}
            </StyledText>
            <StyledText isTitle style={{ marginTop: MARGIN_TOP_SM }}>Ввод данных</StyledText>

            <StyledText color={Colors.gray} size={TEXT_SIZE_11} style={{ marginTop: DESCRIPTION_TOP }}>
              Данные заявителя
            </StyledText>

            <StyledInput
              style={{ marginTop: MARGIN_TOP_MD }}
              value={fio}
              label={`ФИО участника строительства`}
              autoCapitalize={'words'}
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

            <Delimiter />

            <StyledText color={Colors.gray} size={TEXT_SIZE_11} style={{ marginTop: MARGIN_TOP_MD }}>
              Данные по объекту недвижимости
            </StyledText>

            <StyledText bold style={{ marginTop: MARGIN_TOP_SM }} size={TEXT_SIZE_15}>Договор</StyledText>

            {/* <StyledInput
              keyboardType={'numeric'}
              style={{ marginTop: MARGIN_TOP_MD }}
              value={ddu}
              label={`Номер ДДУ (необязательно)`}
              onChangeText={(text) => this.setState({ ddu: text })}
            /> */}
            
            <TextInputMask
              keyboardType='default'
              type={'custom'}
              options={{
                mask: '**************************************'
              }}
              value={ddu}
              innerLabel={`Номер ДДУ (необязательно)`}
              onChangeText={(text) => {
                this.setState({ ddu: text })
              }}
            />
          

            <TextInputMask
              type={'datetime'}
              value={contractDate}
              innerLabel={`Дата заключения договора`}
              rightIconType={`datePicker`}
              rightIconPress={() => this.setState({
                contractDateVisible: true,
                contractDate: contractDate || moment(transferDate, 'DD.MM.YYYY').subtract(1, 'days').format('DD.MM.YYYY').toString()
              })}
              disabled
            />


            <StyledText
              color={Colors.grayDark}
              style={{ marginTop: MARGIN_TOP_SM, marginLeft: 5, marginBottom: MARGIN_TOP_SM }}
              size={TEXT_SIZE_14}
            >
              Дата, до наступления которой должна быть передана квартира
            </StyledText>

            <TextInputMask
              type={'datetime'}
              value={transferDate}
              innerLabel={`Дата`}
              rightIconType={`datePicker`}
              rightIconPress={() => this.setState({
                transferDateVisible: true,
                transferDate: transferDate || moment().format('DD.MM.YYYY')
              })}
              multiline
              disabled
            />
            
            <StyledText bold style={{ marginTop: MARGIN_TOP_LG }} size={TEXT_SIZE_15}>Застройщик</StyledText>

            <View style={{ marginTop: MARGIN_TOP_MD }} />
            <TextInputMask
              type={'custom'}
              options={{
                mask: '9999 9999 9999 9999'
              }}
              value={builderInn}
              innerLabel={`ИНН застройщика`}
              onChangeText={(text) => this.onChangeInn(text)}
            />
            <StyledInput
              value={builderName}
              label={`Наименование застройщика`}
              onChangeText={(text) => this.setState({ builderName: text })}
            />
            <StyledInput
              value={builderAddress}
              label={`Адрес застройщика`}
              onChangeText={(text) => this.setState({ builderAddress: text })}
            />

            <StyledText bold style={{ marginTop: MARGIN_TOP_LG }} size={TEXT_SIZE_15}>Квартира</StyledText>

            <StyledInput
              style={{ marginTop: MARGIN_TOP_MD }}
              value={apartmentAddress}
              label={`Адрес квартиры`}
              onChangeText={(text) => this.setState({ apartmentAddress: text })}
            />
            <StyledInput
                style={{ flex: 1.3 }}
                keyboardType={`numeric`}
                selectedItem={selectedRoom}
                value={selectedRoom !== null ? apartmentRooms[selectedRoom] : null}
                label={`Кол-во комнат`}
                rightIconType={`picker`}
                pickerData={apartmentRooms}
                onItemChange={(value) => this.setState({ selectedRoom: value })}
                disabled
              />
            <View style={{ flexDirection: 'row' }}>
              {/* <StyledInput
                style={{ flex: 1.3 }}
                keyboardType={`numeric`}
                selectedItem={selectedRoom}
                value={selectedRoom !== null ? apartmentRooms[selectedRoom] : null}
                label={`Кол-во комнат`}
                rightIconType={`picker`}
                pickerData={apartmentRooms}
                onItemChange={(value) => this.setState({ selectedRoom: value })}
                disabled
              /> */}
              {/* <StyledInput
                style={{ flex: 1, marginLeft: 2, minWidth: 150  }}
                keyboardType={`numeric`}
                value={apartmentArea}
                label={`Общая площадь`}
                onChangeText={(text) => {

                  if (text.length > apartmentArea?.length
                    && text[text.length - 1] === ','
                    && apartmentArea.includes(',')) {return }

                  if (text.length > apartmentArea?.length
                    && (text[text.length - 1] === '.' || text[text.length - 1] === ',')
                    && (apartmentArea.includes(',') || apartmentArea.includes('.'))) {return }


                  this.setState({ apartmentArea: text })
                }}
                maxLength={5}
              /> */}

              
              <TextInputMask
                // type={'custom'}
                type={'custom'}
                options={{
                  mask: '**********'
                }}
                // suffixUnit={'кв.м'}
                value={apartmentArea}
                innerLabel={`Общая площадь (кв. м)`}
                // onChangeText={(text) => this.setState({ apartmentArea: text })}
                onChangeText={(text) => {
                  // text = text.split(',')[0]

                  // if (text.length > apartmentArea?.length
                  //   && text[text.length - 1] === ','
                  //   && apartmentArea.includes(',')) {return }

                  // if (text.length > apartmentArea?.length
                  //   && (text[text.length - 1] === '.' || text[text.length - 1] === ',')
                  //   && (apartmentArea.includes(',') || apartmentArea.includes('.'))) {return }


                  this.setState({ apartmentArea: text })
                }}
              />
            </View>

            {/* <View style={{ flexDirection: 'row' }}> */}
              <StyledInput
                style={{ minWidth: 120 }}
                selectedItem={selectedFloor}
                value={selectedFloor !== null ? `${floors[selectedFloor]} этаж` : null}
                label={`Этаж`}
                rightIconType={`picker`}
                pickerData={floors}
                onItemChange={(value) => this.setState({
                  selectedFloor: value
                })}
                disabled
              />
              {/* <StyledInput
                style={{ flex: 1.3, marginLeft: 2 }}
                keyboardType={`numeric`}
                selectedItem={buildingFloorNumber}
                value={buildingFloorNumber !== null ? `${buildingFloors[buildingFloorNumber]} ${num2str(buildingFloorNumber + 1)}` : null}
                label={`Этажность дома`}
                pickerData={buildingFloors}
                rightIconType={`picker`}
                disabled
                onItemChange={(value) => {
                  this.setState({
                    buildingFloorNumber: value,
                    selectedFloor: value < selectedFloor ? value : selectedFloor,
                    floors: Array.from(Array(value + 2), (itm, i) => { if (i) { return `${i}` }}).filter(Boolean)
                  })}
                }
              /> */}
            {/* </View> */}
            <TextInputMask
              type={'money'}
              value={apartmentPrice}
              innerLabel={`Цена квартиры (договора)`}
              onChangeText={(text) => {
                if (text.length > 11) { return }

                this.setState({ apartmentPrice: text }, () => {
                  this.onChangeTrigger()
                  
              })}}
            />

            {editing ? (
              <View>
                <Delimiter />

                <StyledText color={Colors.gray} bold style={{ marginTop: MARGIN_TOP_MD }} size={TEXT_SIZE_11}>
                  Реквизиты для выплаты неустойки
                </StyledText>

                <View style={{ marginTop: MARGIN_TOP_MD }} />

                <View style={{ flexDirection: 'row' }}>
                  <CheckBox
                    title={`Банковским переводом`}
                    onPress={() => this.setState({ requisites: 0 })}
                    checked={requisites === 0}
                    radioButton
                  />
                  <CheckBox
                    title={`На карту`}
                    onPress={() => this.setState({ requisites: 1 })}
                    checked={requisites === 1}
                    radioButton
                  />
                </View>

                <View style={{ marginTop: MARGIN_TOP_MD }} />



                {requisites === 0 ? this._renderBankInputs() : this._renderCardInputs()}
                
                {/* <CheckBox
                  title={`Cогласен с условиями работы сервиса`}
                  onPress={() => this.setState({
                    conditionsAgree: !conditionsAgree,
                    progress: progress + 0.3
                  })}
                  checked={conditionsAgree}
                /> */}


                <Delimiter />

                <StyledText color={Colors.gray} bold style={{ marginTop: MARGIN_TOP_MD }} size={TEXT_SIZE_11}>
                  Сумма претензии
                </StyledText>

                <View style={{ marginTop: MARGIN_TOP_MD }} />



                <BlueBox style={{ height: 113, alignItems: 'center', justifyContent: 'center' }}>
                  <StyledText isTitle>
                  <TextMask
                      value={editingData.sum.forfeit}
                      type={'money'}
                      options={{
                        precision: 0,
                        separator: null,
                        delimiter: ' ',
                        unit: null,
                        suffixUnit: null
                      }}
                    />
                    ₽
                  </StyledText>

                  <StyledText centered lineHeight={2.2} color={Colors.grayDark} style={{ marginTop: 10 }}>
                    Сумма по договору неустойки  — 
                    {' '}
                    <TextMask
                      value={editingData.sum.penalty}
                      type={'money'}
                      options={{
                        precision: 0,
                        separator: null,
                        delimiter: ' ',
                        unit: null,
                        suffixUnit: null
                      }}
                    />
                    ₽
                    {'\n'}
                    5% комиссия платформы — 
                    {' '}
                    <TextMask
                      value={editingData.sum.commission}
                      type={'money'}
                      options={{
                        precision: 0,
                        separator: null,
                        delimiter: ' ',
                        unit: null,
                        suffixUnit: null
                      }}
                    />
                    ₽
                  </StyledText>
                  {/* <StyledText ineHeight={1.2} color={Colors.grayDark}>
                    5% комиссия платформы — {3333}
                  </StyledText> */}
                </BlueBox>

                {editingData.additionalSum.length ? (
                  editingData.additionalSum.map((addition, i) => 
                    this._renderBlueBox(`Доп. сумма №${i+1}`, addition.type, addition.sum))
                ) : null}
                <View style={{ marginTop: 8 }} />

                {/* {this._renderBlueBox('Доп. сумма №1', 'Аренда альтернативного жилья', 77777)}
                {this._renderBlueBox('Доп. сумма №1', 'Аренда альтернативного жилья', 77777)}
                {this._renderBlueBox('Доп. сумма №1', 'Аренда альтернативного жилья', 77777, true)}
                {this._renderBlueBox('Доп. сумма №1', 'Аренда альтернативного жилья', 77777)} */}

              </View>
            ) : null}

            
            </View>
          </KeyboardAwareScrollView>
          

        {this.state.hideKeyboard ? null : (
          <FooterWrapper
            // style={{ top: isIos ? SCREEN_HEIGHT - 160 : SCREEN_HEIGHT - (175 - 0) }}
            style={{ bottom: 0 }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.05)']}
              style={{
                height: 20,
                alignItems: 'center',
                width: '100%',
                position: 'absolute',
                top: -20,
                zIndex: -1
              }}
            />
            <Progress.Bar
              progress={this.getComplete()}
              width={Dimensions.get('screen').width}
              color={Colors.blue}
              borderRadius={0}
              unfilledColor={'#E2E2E2'}
              height={2}
              borderColor={'transparent'}
            />
            <Footer>
              {editing ? ( // && !addition
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <MainButton
                    style={{ flex: 1, backgroundColor: 'white' }}
                    disabled={penalty.isFetching}
                    title={`Отмена`}
                    onPress={() => navigation.goBack()}
                    textStyle={{ color: Colors.blue }}
                  />
                  <MainButton
                    style={{ flex: 1 }}
                    disabled={penalty.isFetching}
                    title={`Сохранить`}
                    onPress={() => this.onSave()}
                  />
                </View>
              ) : (
                <MainButton
                  disabled={penalty.isFetching}
                  title={`Далее`}
                  onPress={this.onContinue}
                />
              )}
              
            </Footer>
          </FooterWrapper>
        )}
        



        <ModalBottom
          visible={contractDateVisible}
          type="datePicker"
          title={'Дата заключения договора'}
          onButtonPress={() => this.setState({ contractDateVisible: false })}
          onSwipeOut={() => this.setState({ contractDateVisible: false })}
          onDateChange={(date) => this.setState({ contractDate: moment(date).format('DD.MM.YYYY') }, () => {
            this.onChangeTrigger()
          })}
          date={contractDate ? moment(contractDate, 'DD.MM.YYYY').toDate() : null}
          maximumDate={moment(transferDate, 'DD.MM.YYYY').subtract(1, 'days').toDate()}
        />
        <ModalBottom
          visible={transferDateVisible}
          type="datePicker"
          title={'Дата, до наступления которой должна быть передана квартира'}
          onButtonPress={() => this.setState({ transferDateVisible: false })}
          onSwipeOut={() => this.setState({ transferDateVisible: false })}
          onDateChange={(date) => this.setState({ transferDate: moment(date).format('DD.MM.YYYY') }, () => {
            this.onChangeTrigger()
          })}
          date={transferDate ? moment(transferDate, 'DD.MM.YYYY').toDate() : null}
          maximumDate={moment().subtract(1, 'days').toDate()}
          minimumDate={contractDate ? moment(contractDate, 'DD.MM.YYYY').add(1, 'days').toDate() : null}
        />

        </SafeAreaView>
      </MainLayout>
    );
  }
}

export default connect(penaltyCreationSelector)(PenaltyCreationScreen)

const Container = styled.View`
  
`;

const FooterWrapper = styled.View`
  /* position: absolute; */
  /* bottom: -100px; */
  height: 100px;
  width: 100%;
`;

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

const Delimiter = styled.View`
  margin-top: 5%;
  height: 25px;
  width: ${Dimensions.get('screen').width};
  background-color: ${Colors.grayLight};
  align-self: center;
`;

const BlueBox = styled.View`
  width: 100%;
  background-color: ${Colors.blueLight};
  border-radius: 5px;
  margin-top: 2px;
  height: 70px;
  padding-vertical: 12px;
  padding-horizontal: 20px;
`;