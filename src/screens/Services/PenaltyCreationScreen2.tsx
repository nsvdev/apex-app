import React from 'react';
import { FlatList, Text, View, Dimensions, Alert } from 'react-native';
import styled from 'styled-components/native';
import {
  MainLayout,
  StyledText,
  TotalAmount,
  MainButton,
  StyledInput,
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
  SCREEN_WIDTH
} from '../../constants';
import { connect } from 'react-redux'
import { penaltyCreationSelector } from 'redux/selectors';
import { WebView } from 'react-native-webview';
import { ScrollView } from 'react-native-gesture-handler';
import { createPenalty, setPenalty } from 'redux/actions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface Props {
  dispatch
  navigation
  penalty: IPenaltyAppilationStore
}

const itemTypes = [
  'Аренда альтернативного жилья',
  'Моральный вред',
  'Юридические услуги',
  'Проценты по кредиту'
]

class PenaltyCreationScreen2 extends React.Component<Props> {

  state = {
    items: [],
    scrollOffset: 0,
    hideBottom: false,
    currentValue: 0
  }

  componentDidMount() {
    const { penalty } = this.props;


    // console.log(penalty.additionalSum)
  }

  addItem = () => {
    const { items } = this.state;

    let sumExist = true

    items.map(itm => {
      if (!itm.sum) {
        sumExist = false
      }
    })

    if (!sumExist) {
      alert("Введите сумму для предыдущего типа")
      return
    }

    items.push({ type: null, sum: null })
    this.setState({ items })
  }

  handleScroll = ({ nativeEvent }) => {
    this.setState({ scrollOffset: nativeEvent.contentOffset.y })
  }
  
  onNext = () => {
    const { dispatch, penalty, navigation, route } = this.props;
    const { items } = this.state;

    console.log(items)

    // check null sum
    let error = false
    // items.map((item, i) => {
    //   if (!item['sum']) {
    //     // error = true
    //     items[i]['sum'] = 0
    //   }
    // })
    if (error) {
      Alert.alert('Ошибка', 'Заполните поле дополнительной суммы')
      return
    }

    console.log('--- -- ---')
    console.log(items)

    let isEditing = false
    if (route.name === 'PenaltyEdit2') {
      isEditing = true
    }

    // if (isEditing) {
    //   navigation.navigate('PenaltyEdit3')
    // } else {
    //   navigation.navigate('PenaltyCreation3')
    // }
    // return

    dispatch(setPenalty({
      additionalSum: this.state.items,
    }))

    dispatch(createPenalty({
      fullName: penalty.fullName,
      buildingAddress: penalty.buildingAddress,
      ddu: penalty.ddu,
      conclusionDate: penalty.conclusionDate,
      transferDate: penalty.transferDate,
      inn: penalty.inn,
      developerName: penalty.developerName,
      developerAddress: penalty.developerAddress,
      houseAddress: penalty.houseAddress,
      roomCount: penalty.roomCount,
      area: penalty.area,
      floor: penalty.floor,
      numberStoreys: penalty.numberStoreys,
      housePrice: Number(penalty.housePrice.replace(/\s/g, '')),
      additionalSum: this.state.items,
      sum: penalty.receiveAmount,

      bankData: {
        bik: penalty.bankData?.bik,
        bankAccountNumber: penalty.bankData?.bankAccountNumber,
        receiverFio: penalty.bankData?.receiverFio
      },
      


      // requisites
    }, navigation, isEditing))
  }

  render() {
    const
      { penalty } = this.props,
      { items, scrollOffset } = this.state;

    return (
      <MainLayout disablePadding showShadow={scrollOffset > 0} style={{ width: SCREEN_WIDTH }}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 100,
            backgroundColor: Colors.background,
            paddingHorizontal: PADDING_SIZE
          }}
          onScroll={this.handleScroll}
          onKeyboardDidShow={() => this.setState({ hideBottom: true })}
          onKeyboardDidHide={() => this.setState({ hideBottom: false })}
        >
          
          <StyledText size={TEXT_SIZE_15} color={Colors.gray} style={{ marginTop: TITLE_TOP }}>Создание заявки. Шаг 2/4</StyledText>
          <StyledText isTitle style={{ marginTop: MARGIN_TOP_SM }}>Сумма претензии</StyledText>

          <View style={{ width: '100%', alignItems: 'center' }}>
            <StyledText size={TEXT_SIZE_13} style={{ marginTop: MARGIN_TOP_LG }}>
              Сумма которую вы получите
            </StyledText>
          </View>

          <View style={{ marginTop: MARGIN_TOP_MD }} />
          <TotalAmount
            value={penalty.receiveAmount}
            // style={{ backgroundColor: 'transparent' }}
            hintVisible
            hintTitle={penalty.hintTitle}
            hintDescription={penalty.hintDescription}
          />

          <View style={{ width: '100%', alignItems: 'center' }}>
            <StyledText color={Colors.gray} size={TEXT_SIZE_12} style={{ marginTop: MARGIN_TOP_SM }}>
              Сумма без учета дополнительных сумм
            </StyledText>
          </View>

          {items.length ? (
            <View style={{ marginTop: MARGIN_TOP_MD }}>
              {items.map((item, i) => (
                <View style={{ marginTop: 20 }} key={i}>
                  <StyledText>дополнительная сумма {i+1}</StyledText>

                  <View style={{ marginTop: MARGIN_TOP_MD }} />
                  <StyledInput
                    selectedItem={item.type}
                    value={item.type !== null ? itemTypes[item.type] : null}
                    label={`Выбрать тип суммы`}
                    rightIconType={`picker`}
                    pickerData={itemTypes.filter(word => {
                      return !items.map(itm => {
                        if (itm.sum) {
                          return itemTypes[itm.type]
                        } else {
                          return ''
                        }
                      }).includes(word)
                    })}
                    onItemChange={(value) => {
                      this.setState({
                        currentValue: value
                      })
                    }}
                    onButtonPress={() => {
                      const filteredItms = itemTypes.filter(word => {
                        return !items.map(itm => {
                          if (itm.sum) {
                            return itemTypes[itm.type]
                          } else {
                            return ''
                          }
                        }).includes(word)
                      })

                      let itms = this.state.items
                      itms[i].type = itemTypes.indexOf(filteredItms[this.state.currentValue]) // itemTypes[value]

                      this.setState({
                        items: itms
                      })
                    }}
                    disabled
                  />

                  {/* <TextInputMask
                    style={{ marginTop: 10 }}
                    keyboardType={`numeric`}
                    value={item.sum !== null ? item.sum : null}
                    label={`Введите сумму`}
                    onChangeText={(text) => this.setState({ apartmentArea: text })}
                    rightIconType={`money`}
                  /> */}
                  {/* <View style={{ marginTop: 10 }} /> */}
                  <TextInputMask
                    type={'money'}
                    value={item.sum}
                    innerLabel={`Введите сумму`}
                    rightIconType={`money`}
                    onChangeText={(text) => {
                      let itms = this.state.items
                      itms[i].sum = text
                      this.setState({ items: itms })
                    }}
                  />
                </View>
              ))}
            </View>
          ) : null}

          <View style={{ marginTop: MARGIN_TOP_LG }} />
            {items.length > 3 ? null : (
              <MainButton
                textStyle={{ color: Colors.blue }}
                style={{ backgroundColor: Colors.grayLight }}
                title={`+ Добавить дополнительную сумму`}
                onPress={() => this.addItem()}
                dashed
              />
            )}

            <View style={{ width: '100%', alignItems: 'center' }}>
            <StyledText color={Colors.grayDark} size={TEXT_SIZE_13} style={{ marginTop: MARGIN_TOP_MD }}>
              Сумма аренды и т.д.
            </StyledText>
          </View>

        </KeyboardAwareScrollView>

        <View
          style={{
            position: 'absolute',
            bottom: this.state.hideBottom ? -100 : 0,
            width: SCREEN_WIDTH,
            alignSelf: 'center',
            justifyContent: 'center',
            paddingTop: 20,
            paddingBottom: 20,
            paddingHorizontal: 20,
            backgroundColor: 'white'
          }}
        >
          <MainButton
            title={`Далее`}
            onPress={() => this.onNext()}
          />
        </View>
      </MainLayout>
    )
  }
}

export default connect(penaltyCreationSelector)(PenaltyCreationScreen2)