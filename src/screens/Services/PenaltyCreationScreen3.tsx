import React, { useState } from 'react';
import { FlatList, Text, View, Dimensions, Image, TouchableOpacity, Modal, ScrollView, Linking } from 'react-native';
import styled from 'styled-components/native';
import {
  MainLayout,
  StyledText,
  TotalAmount,
  MainButton,
  StyledInput
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
import { isIos } from 'utils';
import { StackActions } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { clearPenalty, setPenalty } from 'redux/actions'
import PenaltyCompleteModal from './PenaltyCompleteModal'
import { setUser } from 'redux/actions/user';

interface Props {
  dispatch
  navigation
  user
  penalty: IPenaltyAppilationStore
}

const PenaltyCreationScreen3 = (props) => {
  const [scrollOffset, setScrollOffset] = useState(0)
  const [completeVisible, setCompleteVisible] = useState(false)

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => goToMain()}
        >
          <Image
            resizeMode="contain"
            source={require('assets/images/back.png')}
            style={{ width: 20, height: 20, marginHorizontal: 0, marginLeft: isIos ? 20 : 10 }}
          />
          <Image
            resizeMode="contain" source={require('assets/images/logo.png')}
            style={{ width: 83, height: 16, marginHorizontal: 20 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [props.navigation]);

  const goToMain = () => {
    props.dispatch(setUser({
      name: null,
      lastName: null,
      middleName: null,
    }))

    props.dispatch(setPenalty({
      fullName: null,
    }))

    props.navigation.dispatch(StackActions.popToTop());
  }


  const onGoToGosUslugi = () => {
    Linking.openURL('https://ej.sudrf.ru/')
  }

  return (
    <MainLayout showShadow={scrollOffset > 0}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 300
        }}
      >
      {/* <ScrollView
        style={{ flex: 1, minHeight: '100%' }}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: Colors.background,
          minHeight: '100%'
        }}
        onScroll={this.handleScroll}
      > */}
        <StyledText size={TEXT_SIZE_15} color={Colors.gray} style={{ marginTop: TITLE_TOP }}>Создание заявки. Шаг 3/4</StyledText>
        <StyledText isTitle style={{ marginTop: MARGIN_TOP_SM }}>Подача документов</StyledText>
        <StyledText color={Colors.gray} style={{ marginTop: MARGIN_TOP_MD }}>
        {`Уважаемый, ${props.user.lastName} ${props.user.name} ${props.user.middleName || ''} \n \n`}
        
        {`Выберите один из вариантов дальнейшей работы.
        \n- Под ключ. Мы берем на себя все функции по взысканию долга: обращаемся с претензией, готовим исковое заявление в суд, а также любые иные заявления в суд, заявление о выдаче исполнительного листа, о возбуждении исполнительного производства в службе судебных приставов. Клиент через мобильное приложение сможет оценить ход оказания услуги в текущем режиме. Услуга условно-бесплатная. Стоимость услуги определяется в ходе ее оказания и составляет 5% от размера взысканных с застройщика денежных средств, никакая предварительная и иная последующая оплата не осуществляется. Для взыскания долга мы заключаем договор уступки прав требований в части взыскания неустойки с застройщика, поэтому от клиента никакие иные действия, кроме подписания договора, не требуются. Подписание договора осуществляется путем бесплатного вызова курьера.
        \n- Самостоятельное обращение в суд. При втором варианте система изготавливает в автоматическом режиме на основании предоставленных клиентом данных исковое заявление в соответствии со всеми требованиями законодательства исковое заявление о взыскании долга с застройщика. Клиенту предоставляется ссылка на скачивание документа и возможность вручную подать заявление в районный суд через авторизацию через портал Госуслуг (при наличии аккаунта на портале). >Клиенту также предоставляются советы по дальнейшему самостоятельному взысканию долга. Услуга платная, в форме предоплаты.
        \n Стоимость услуги составляет 100 руб.`}
        </StyledText>

        <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center', width: '100%' }}>
          <MainButton
            title={`Через курьера APEXCOM (под ключ)`}
            onPress={() => {
              // setCompleteVisible(true)
              
              props.navigation.navigate('Requisites')
            }}
          />

          <View style={{ width: '100%', alignItems: 'center' }}>
            <StyledText centered color={Colors.grayDark} size={TEXT_SIZE_12} style={{ marginTop: MARGIN_TOP_MD }}>
              К вам приедет курьер и заберет подписанные документы.
            </StyledText>
          </View>

          <MainButton
            style={{
              marginTop: 20,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#E2E2E2',
              borderRadius: 5
            }}
            onPress={() => onGoToGosUslugi()}
            title='Подать через ГосУслуги'
            textStyle={{ color: Colors.blue }}
            gosUslugi
          />
        </View>




        <Modal
          visible={completeVisible}
          animationType={`slide`}
        >
          <PenaltyCompleteModal
            onClose={() => {
              setCompleteVisible(false)

              setTimeout(() => {
                props.dispatch(clearPenalty())
                props.navigation.dispatch(StackActions.popToTop());
              }, 300);
            }}
            toPersonalArea={() => {
              setCompleteVisible(false)

              setTimeout(() => {
                props.dispatch(clearPenalty())

                props.navigation.dispatch(StackActions.popToTop());

                const jumpToAction = DrawerActions.jumpTo('PersonalArea');
                props.navigation.dispatch(jumpToAction);
              }, 300);
            }}
          />
        </Modal>

        </ScrollView>
    </MainLayout>
  )
}

export default connect(penaltyCreationSelector)(PenaltyCreationScreen3)