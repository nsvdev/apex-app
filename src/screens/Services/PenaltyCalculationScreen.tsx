import React from 'react';
import styled from 'styled-components/native';
import {
  MainLayout,
  StyledText,
  MainButton,
  ModalBottom,
  TextInputMask,
  TotalAmount
} from 'components';
import { TITLE_TOP, DESCRIPTION_TOP, SCREEN_HEIGHT, SCREEN_WIDTH, TEXT_SIZE_13 } from '../../constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { View, Dimensions, Alert, BackHandler } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux'
import { servicesSelector } from 'redux/selectors';
import { setPenalty } from 'redux/actions';

import Api from 'api';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const hintTitle = 'Внимание!'
const hintDescription = 'В соответствии с постановлением Правительства № 423 от 2 апреля 2020 г. в период с 03 апреля 2020 г. по 01 января 2021 г. неустойка за неисполнение обязательств застройщиком не начисляется в связи с развитием коронавирусной инфекции (Covid-2019). При расчете размера неустойки застройщика положения данного нормативного акта учтены.'

interface Props {
  route
  navigation
  token: string
  dispatch
  penalty: IPenaltyAppilationStore
}

class PenaltyCalculationScreen extends React.Component<Props> {

  state = {
    contractPrice: null,
    datePickerVisible: false,
    value: null,
    dueDate: __DEV__ ? '09.05.2017' : null,
    actualDate: __DEV__ ? '09.06.2017' : null,
    currentPicker: {
      title: null,
      value: null
    },
    date: new Date(),
    screenHeight: null,
    alertVisible: false
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.hideModal)

    this.props.dispatch(setPenalty({ hintTitle, hintDescription }))
  }

  hideModal = () => {
    setTimeout(() => {
      this.setState({
        contractPrice: '5000000',
        datePickerVisible: false,
        alertVisible: false
      })
    }, 100);
    return this.state.datePickerVisible || this.state.alertVisible ? true : false
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.hideModal)
  }

  onDatePress = ({ title, value}) => {
    this.setState({
      datePickerVisible: true,
      currentPicker: {
        title,
        value
      },
      [value]: this.state[value] || moment().format('DD.MM.YYYY').toString()
    }, this.onChangeTrigger)

    // if (value === 'dueDate') {
    //   this.setState({ actualDate: null }, this.onChangeTrigger)
    // }
  }

  onChangeTrigger = async () => {
    const { dueDate, actualDate, contractPrice } = this.state;

    

    if (dueDate && actualDate && contractPrice) {
      try {
        const result: any = await Api.Services.calcultePenalty({
          cost: contractPrice.replace(/ /g,''),
          dateStart: dueDate,
          dateEnd: actualDate
        })
  
        if (result.success) {
          let cost = result.data
          this.setState({ 
            value: cost || '0'
          })
        }
      } catch (err) {
        this.setState({ 
          value: '0'
        })
      }
    }
  }

  onDateChange = (date) => {
    const { currentPicker } = this.state;
    
    this.setState({
      date,
      [currentPicker.value]: moment(date).format('DD.MM.YYYY')
    }, this.onChangeTrigger) // this.onChangeTrigger after upodate ?
  }

  navigate = () => {
    const { route, navigation, dispatch } = this.props;

    dispatch(setPenalty({
      receiveAmount: this.state.value,
      housePrice: this.state.contractPrice,
      transferDate: this.state.dueDate,
      conclusionDate: this.state.actualDate,
    }))

    this.setState({ alertVisible: false }, () => {
        // const service: IService = route.params.service;
        navigation.navigate('ServiceDetails')
    })
  }

  onEnter = () => {
    const
      { route, navigation, dispatch } = this.props,
      { contractPrice, datePickerVisible, value, dueDate, actualDate, currentPicker } = this.state;

    // Периоды в которые нельзя получить неустойку
    const format = 'DD.MM.YYYY'
    const momentStart = moment("01.04.2020", format);
    const momentEnd = moment("01.01.2021", format);
    const momentDue = moment(dueDate, format);
    const momentActual = moment(actualDate, format);


    if ((momentDue > momentStart || momentActual > momentStart)
      && (momentDue < momentEnd || momentActual < momentEnd)) {
        // Alert.alert(
        //   `Внимание!`, // ${response.status}
        //   'теперь неустойку нельзя получить за дни, входящие в период с 3 апреля 2020 по 1 января 2021.',
        //   [
        //     {text: 'Понятно', onPress: this.navigate},
        //   ],
        //   {cancelable: false},
        // );
        this.setState({ alertVisible: true })
    } else {
      this.navigate()
    }
  }

  onSwipeOut = () => {
    const { dueDate, actualDate } = this.state;

    this.setState({
      actualDate: moment(dueDate, 'DD.MM.YYYY') > moment(actualDate, 'DD.MM.YYYY')
        ? moment(dueDate, 'DD.MM.YYYY').add(1, 'days').format('DD.MM.YYYY').toString()
        : actualDate,
      datePickerVisible: false
    }, () => this.onChangeTrigger())
  }

  render() {
    const
      { route, penalty } = this.props,
      {
        contractPrice,
        datePickerVisible,
        value,
        dueDate,
        actualDate,
        currentPicker,
        alertVisible
      } = this.state;
      // service: IService = route.params.service;

    return (
      <MainLayout>
        <KeyboardAwareScrollView
          onLayout={({ nativeEvent: { layout } }) => {
            if (!this.state.screenHeight) {
              this.setState({ screenHeight: layout.height })
            }
          }}
          enableAutomaticScroll={false}
          style={{ width: '100%', backgroundColor: 'white' }}
          contentContainerStyle={{
            minHeight: this.state.screenHeight || null
          }}
          enableOnAndroid={false}
          extraScrollHeight={10}
        >
          <StyledText isTitle style={{ marginTop: TITLE_TOP }}>
            Расчет суммы неустойки
          </StyledText>
          <StyledText style={{ marginTop: DESCRIPTION_TOP, width: '95%' }}>
            {/* Посчитайте сколько вы можете отсудить у строительной
            компании исходя из просрочки по ДДУ */}
            Рассчитайте размер возможного взыскания денежных средств с застройщика
          </StyledText>

          <InputsWrapper>
            <TextInputMask
              type={'money'}
              options={{
                precision: 0,
                separator: null,
                delimiter: ' ',
                unit: null,
                suffixUnit: null
              }}
              onBlur={({ nativeEvent: { text } }) => this.onChangeTrigger()}
              value={contractPrice}
              onChangeText={(text) => {
                if (text.length > 11) { return }
                
                this.setState({ contractPrice: text })
              }}
              innerLabel={`Стоимость имущества \nпо договору`}
              innerLabelWithValue={`Стоимость имущества по договору`}
              multiline
            />
            <TextInputMask
              type={'datetime'}
              options={{
                format: 'DD.MM.YYYY'
              }}
              value={dueDate}
              innerLabel={`Дата окончания строительства \nпо договору`}
              innerLabelWithValue={`Дата окончания строительства по договору`}
              multiline
              rightIconType={`datePicker`}
              rightIconPress={() => this.onDatePress({ title: `Дата окончания строительства по договору`, value: 'dueDate'})}
              disabled
            />
            <TextInputMask
              type={'datetime'}
              options={{
                format: 'DD.MM.YYYY'
              }}
              value={actualDate}
              innerLabel={`Фактическая дата \nокончания строительства`}
              innerLabelWithValue={`Фактическая дата окончания строительства`}
              multiline
              rightIconType={`datePicker`}
              rightIconPress={() => this.onDatePress({ title: `Фактическая дата окончания строительства`, value: 'actualDate'})}
              disabled
            />
          </InputsWrapper>

          {value && contractPrice && dueDate && actualDate ? (
            <View
              style={{
                // position: 'absolute',
                marginBottom: 20,
                flex: 1,
                justifyContent: 'flex-end',
                width: '100%'
              }}
            >
              <StyledText
                size={2}
                style={{ marginTop: '7%', width: '100%' }}
              >
                Примерная сумма, которую Вы получите
              </StyledText>

              <AmountBottomWrapper>
                <TotalAmount
                  value={value}
                  style={{ backgroundColor: 'transparent' }}
                  hintVisible={!(moment(actualDate, 'DD.MM.YYYY') < moment('03.04.2020', 'DD.MM.YYYY'))}
                  hintTitle={penalty.hintTitle}
                  hintDescription={penalty.hintDescription}
                />
                <MainButton
                  title={`Создать заявку`}
                  onPress={this.onEnter}
                />
              </AmountBottomWrapper>
            </View>
          ) : null}

          <ModalBottom
            visible={datePickerVisible}
            onSwipeOut={() => this.onSwipeOut()}
            type='datePicker'
            onDateChange={this.onDateChange}
            title={currentPicker?.title}
            date={moment(this.state[currentPicker.value], 'DD.MM.YYYY').toDate()}
            minimumDate={currentPicker.value === 'actualDate' && dueDate ? moment(dueDate, 'DD.MM.YYYY').toDate() : null}
            maximumDate={new Date()}
            onButtonPress={() => {
              this.setState({ datePickerVisible: false })

              setTimeout(() => {
                this.setState({ datePickerVisible: false })
              }, 150);

              // setTimeout(() => {
              //   this.setState({ datePickerVisible: false })
              // }, 250);
            }}
          />

          <ModalBottom
            visible={alertVisible}
            type="alert"
            title={penalty.hintTitle}
            description={penalty.hintDescription}
            onButtonPress={this.navigate}
            onSwipeOut={() => this.setState({ alertVisible: false })}
            height={SCREEN_HEIGHT < 650 ? RFPercentage(TEXT_SIZE_13 * 35) : RFPercentage(TEXT_SIZE_13 * 26)}
          />
        </KeyboardAwareScrollView>
      </MainLayout>
    );
  }
}

export default connect(servicesSelector)(PenaltyCalculationScreen)

const Container = styled.View`
  
`;

const InputsWrapper: any = styled.View`
  width: 100%;
  align-items: center;
  align-self: center;
  justify-content: flex-end;
  margin-top: ${`${RFPercentage(5)}px`}
`;

const AmountBottomWrapper: any = styled.View`
  width: 100%;
  background-color: rgba(226, 226, 226, 0.5);
  padding: 5px;
  border-radius: 10px;
  margin-top: 8px;
`;