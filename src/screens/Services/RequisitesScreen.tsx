import React from 'react';
import { FlatList, Text, View, Dimensions, Alert } from 'react-native';
import styled from 'styled-components/native';
import {
  MainLayout,
  StyledText,
  TotalAmount,
  MainButton,
  StyledInput,
  ButtonGroup,
  TextInputMask
} from 'components';
import {
  TITLE_TOP,
  DESCRIPTION_TOP,
  Colors,
  MARGIN_TOP_MD,
  TEXT_SIZE_11,
  TEXT_SIZE_12,
  TEXT_SIZE_13,
  TEXT_SIZE_15,
  PADDING_SIZE,
  MARGIN_TOP_SM,
  MARGIN_TOP_LG,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
} from '../../constants';
import { connect } from 'react-redux'
import { penaltyCreationSelector } from 'redux/selectors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { setPenalty } from 'redux/actions'
import { isIos } from 'utils';
import api from 'api';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

interface Props {
  dispatch
  navigation
  penalty: IPenaltyAppilationStore
}

class RequisitesScreen extends React.Component<Props> {

  state = {
    scrollOffset: 0,
    selectedMethod: 0,
    bankData: {
      bik: '',
      bankAccountNumber: '',
      receiverFio: this.props.penalty.fullName,
    },
    cardData: {
      valid: false,
      cvc: '',
      expiry: '',
      number: '',
      receiverFio: '',
    },
    keyboardShown: false
  }

  componentDidMount() {
    if (__DEV__) {
      this.setFakeData()  
    }
  }

  setFakeData = () => {
    const bankData = {
      bik: '32432432432432',
      bankAccountNumber: '23432523423432234234',
      receiverFio: this.props.penalty.fullName,
    }
    this.setState({ bankData })
  }

  onContinue = () => {
    const
      { dispatch, navigation, penalty } = this.props,
      { bankData, cardData } = this.state

    let error = false

    if (this.state.selectedMethod === 0) {
      if (!this.state.bankData.receiverFio.split(' ')[1]) {
        Alert.alert('Ошибка', 'Введите корректные данные в поле ФИО')
        error = true
      }
      if (error) { return }

      dispatch(setPenalty({
        bankData
      }))
      api.Services.updatePenalty(penalty.id, { ...penalty, bankData }, true)
    } else {
      if (!this.state.cardData.receiverFio.split(' ')[1]) {
        Alert.alert('Ошибка', 'Введите корректные данные в поле ФИО')
        error = true
      }
      if (error) { return }

      dispatch(setPenalty({
        cardData
      }))
      api.Services.updatePenalty(penalty.id, { ...penalty, cardData }, true)
    }

    navigation.navigate('TransferDocuments')
  }

  getComplete = () => {
    const { bankData, cardData, selectedMethod } = this.state

    let completed = false
    if (selectedMethod === 0) {
       // bankData
      if (bankData.bik && bankData.bankAccountNumber && bankData.receiverFio && bankData.bik.length === 9 && bankData.bankAccountNumber.length === 24) {
        completed = true
      } else {
        completed = false
      }
    } else {
      // card data
      if (cardData.valid) { // && cardData.receiverFio.split().length >= 2
        completed = true
      } else {
        completed = false
      }
    }

    return completed
  }

  handleScroll = ({ nativeEvent }) => {
    this.setState({ scrollOffset: nativeEvent.contentOffset.y })
  }

  _renderBankData = () => {
    const { bankData } = this.state;

    return (
      <KeyboardAwareScrollView  
        style={{ backgroundColor: Colors.background }}
        contentContainerStyle={{
          // paddingHorizontal: PADDING_SIZE,
          backgroundColor: Colors.background,
          // paddingBottom: PADDING_SIZE + 100
        }}
        onScroll={this.handleScroll}
        onKeyboardDidShow={() => this.setState({ keyboardShown: true })}
        onKeyboardDidHide={() => this.setState({ keyboardShown: false })}
      >
        <TextInputMask
          type={'custom'}
          options={{
            mask: '999999999'
          }}
          value={bankData.bik}
          innerLabel={`Бик Банка`}
          onChangeText={(text) => this.setState({ bankData: {
            ...bankData,
            bik: text 
          }})}
        />
        <TextInputMask
          type={'custom'}
          options={{
            mask: '9999 9999 9999 9999 9999'
          }}
          value={bankData.bankAccountNumber}
          innerLabel={`Номер счета`}
          onChangeText={(text) => this.setState({ bankData: {
            ...bankData,
            bankAccountNumber: text 
          }})}
        />
        <StyledInput
          value={bankData.receiverFio}
          label={`ФИО получателя`}
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
              t = this.state.bankData.receiverFio || ''
            }

            this.setState({
              bankData: {
                ...this.state.bankData,
                receiverFio: t
              }
            })}
          }
        />
      </KeyboardAwareScrollView>
    )
  }

  onCardChange = (form) => {
    this.setState({
      ...this.state,
      cardData: {
        ...form.values,
        valid: form.valid,
        receiverFio: this.state.cardData.receiverFio
      }
    })
  }

  _renderCardData = () => {
    const { cardData } = this.state;

    return (
      <View>
        <LiteCreditCardInput
          onChange={this.onCardChange}
        />
        <StyledInput
          containerStyle={{ paddingLeft: 12 }}
          containerBackground={'white'}
          value={cardData.receiverFio}
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
              t = this.state.cardData.receiverFio || ''
            }

            this.setState({
              cardData: {
                ...this.state.cardData,
                receiverFio: t
              }
            })}
          }
        />
      </View>
    )
  }

  render() {
    const
      { navigation } = this.props,
      { scrollOffset, selectedMethod, bankData, cardData } = this.state;

    return (
      <MainLayout showShadow={scrollOffset > 0}>
        <KeyboardAwareScrollView
          // style={{ flex: 1 }}
          contentContainerStyle={{
            // minHeight: '100%',
            backgroundColor: Colors.background,
            // paddingHorizontal: PADDING_SIZE
          }}
          onScroll={this.handleScroll}
          // onKeyboardDidShow={() => this.setState({ hideBottom: true })}
          // onKeyboardDidHide={() => this.setState({ hideBottom: false })}
          enableOnAndroid={true}
          extraHeight={120}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, minHeight: '100%' }}>
            <StyledText size={TEXT_SIZE_15} style={{ marginTop: TITLE_TOP }}> </StyledText>
            <StyledText isTitle style={{ marginTop: MARGIN_TOP_SM }}>Реквизиты</StyledText>
            <StyledText color={Colors.gray} style={{ marginTop: MARGIN_TOP_MD }}>Текст про деньги</StyledText>

            <StyledText bold style={{ marginTop: MARGIN_TOP_LG, marginBottom: -4 }}>Реквизиты для выплаты неустойки</StyledText>
            <View style={{ marginTop: MARGIN_TOP_MD }}>
              <ButtonGroup
                buttons={['Банковским переводом', 'На карту']} // 'На карту'
                selectedIndex={selectedMethod}
                onSelectIndex={(i) => {
                  if (i === 0) {
                    this.setState({ selectedMethod: i })
                  } else {
                    this.setState({ selectedMethod: i  })
                  }
                }}
              />
            </View>

            <View style={{ marginTop: MARGIN_TOP_MD }} />
            {selectedMethod === 0
              ? this._renderBankData()
              : this._renderCardData()}

          </View>
          
        </KeyboardAwareScrollView>
          
        {this.getComplete() ? (
              <View
                style={{
                  position: 'absolute',
                  // top: isIos ? SCREEN_HEIGHT - 140 : SCREEN_HEIGHT - 150,
                  bottom: 0,
                  alignSelf: 'center', width: '100%',
                  paddingVertical: 20,
                  backgroundColor: 'white'
                }}
              >
                <MainButton
                  title={`Далее`}
                  onPress={() => this.onContinue()}
                />
              </View>
            ) : null}
      </MainLayout>
    )
  }
}

export default connect(penaltyCreationSelector)(RequisitesScreen)