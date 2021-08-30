import React from 'react';
import { FlatList, Text, View, ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import {
  MainLayout,
  StyledText,
  TotalAmount,
  MainButton
} from 'components';
import {
  TITLE_TOP,
  DESCRIPTION_TOP,
  Colors,
  MARGIN_TOP_MD,
  TEXT_SIZE_11,
  TEXT_SIZE_13,
  TEXT_SIZE_15,
  PADDING_SIZE,
  MARGIN_TOP_SM,
  MARGIN_TOP_LG,
  SCREEN_WIDTH
} from '../../constants';
import { connect } from 'react-redux'
import { personalAreaSelector } from 'redux/selectors';
import { getApplications, setPenalty } from 'redux/actions';
import { ApplicationStatusIDs } from 'constants/enums'
import { DrawerActions, StackActions } from '@react-navigation/native';
import moment from 'moment'
import { statusTime } from 'utils'

const hintTitle = 'Внимание!'
const hintDescription = 'В соответствии с постановлением Правительства № 423 от 2 апреля 2020 г. в период с 03 апреля 2020 г. по 01 января 2021 г. неустойка за неисполнение обязательств застройщиком не начисляется в связи с развитием коронавирусной инфекции (Covid-2019). При расчете размера неустойки застройщика положения данного нормативного акта учтены.'

interface Props {
  dispatch
  navigation
  applications: IApplication[]
  auth
  isCasesFetching: Boolean
}

class PersonalAreaScreen extends React.Component<Props> {

  state = {
    scrollOffset: 0
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    this.props.dispatch(getApplications())
  }

  handleScroll = ({ nativeEvent }) => {
    this.setState({ scrollOffset: nativeEvent.contentOffset.y })
  }

  getStatus = (item: IApplication) => {
    let statusText = ''
    let statusColor = '#000000'
    // console.log(item.statuses[item.statuses.length - 1].title)

    switch (item.statuses[item.statuses.length - 1].title) {
      case ApplicationStatusIDs.Sended:
        statusText = item.statuses[item.statuses.length - 1].title
        statusColor = '#666666'
        break;
      case ApplicationStatusIDs.Created:
        statusText = `cоздана ${statusTime(item.statuses[item.statuses.length - 1].created)}`
        break;
      default:
        statusText = `${item.statuses[item.statuses.length - 1].title}`
        break;
    }

    return (
      <Status>
        <StyledText
          color={statusColor}
          size={TEXT_SIZE_11}
        >
          {statusText.length > 27 ? `${statusText.substring(0, 20)}...` : statusText}
        </StyledText>
      </Status>
    )
  }

  navigateToDetails = (application: IApplication) => {
    this.props.dispatch(setPenalty({ id: application.id, hintTitle, hintDescription }))
    this.props.navigation.navigate('ApplicationDetails', { application })
  }

  navigateToEdit = (application: IApplication, addition?: boolean) => {
    this.props.dispatch(setPenalty({ id: application.id, hintTitle, hintDescription }))
    // this.props.navigation.navigate('PenaltyCreation', { editing: true, addition: addition, application })
    this.props.navigation.navigate('ApplicationDetails', { application })
  }

  navigateToCreate = () => {
    this.props.dispatch(setPenalty({ hintTitle, hintDescription }))

    if (this.props.auth.token) {
      this.props.dispatch(setPenalty({
        receiveAmount: null,
        housePrice: null
      }))
      // this.props.navigation.navigate('PenaltyEdit')
      this.props.navigation.navigate('PenaltyCalculation')
    } else {
      const jumpToAction = DrawerActions.jumpTo('Auth');
      this.props.navigation.dispatch(jumpToAction)
    }
  }

  _renderItem = (item: IApplication) => {
    return item.statuses.length ? (
      <Item
        onPress={() => this.navigateToDetails(item)}
        disabled={item.statuses[item.statuses.length - 1].title === ApplicationStatusIDs.Incomplete}
        style={{
          width: SCREEN_WIDTH - ((PADDING_SIZE * 2)),
          borderRadius: 5,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.05,
          shadowRadius: 10.46,

          elevation: 5,

          backgroundColor: item.statuses[item.statuses.length - 1].title === ApplicationStatusIDs.WaitingDocuments ? "#FFC212" : 'white',
          margin: 2.5,
          padding: 20,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%' }}>
            <StyledText bold size={TEXT_SIZE_15}>{item.number}</StyledText>
        {/*item.statuses[item.statuses.length - 1].title !== ApplicationStatusIDs.Incomplete ? (*/}
              {item.ddu ? (
                <StyledText size={TEXT_SIZE_15} numberOfLines={2}>
                  {`Исковое заявление по договору долевого участия № ${item.ddu}`}
                </StyledText>
              ) : null}
              
            {/*) : null*/}
          </View>

          {this.getStatus(item)}
        </View>

        {item.statuses[item.statuses.length - 1].title === ApplicationStatusIDs.WaitingDocuments ? (
          <Buttons>
            <ButtonInfo>
              <StyledText size={TEXT_SIZE_11} color={`white`} style={{ paddingLeft: 15 }}>
                {item.statuses[item.statuses.length - 1].title}
                </StyledText>
            </ButtonInfo>
            <RowButton onPress={() => alert('...')}>
              <StyledText style={{ width: '80%' }} size={TEXT_SIZE_11} color={`white`}>Назначить встречу</StyledText>
              <ArrowRight source={require('assets/images/icons/arrow-right.png')} />
            </RowButton>
          </Buttons>
        ) : null}

        {item.statuses[item.statuses.length - 1].title === ApplicationStatusIDs.MoneySent ? (
          <CheckImage source={require('assets/images/icons/circle-check.png')} />
        ) : null}

        {item.statuses[item.statuses.length - 1].title === ApplicationStatusIDs.Incomplete ? (
          <IncompleteWrapper>
            <ButtonInfo onPress={() => this.navigateToEdit(item, true)}>
              <StyledText color={'white'} size={TEXT_SIZE_11}>{item.statuses[item.statuses.length - 1].title}</StyledText>
            </ButtonInfo>
            <IncompleteButton onPress={() => this.navigateToEdit(item, true)}>
              <ArrowRight source={require('assets/images/icons/arrow-right.png')} />
            </IncompleteButton> 
          </IncompleteWrapper>
        ) : null}
      </Item>
    ) : null
  }

  render() {
    const
      { scrollOffset } = this.state,
      { applications } = this.props

    return (
      <MainLayout showShadow={scrollOffset > 0} disablePadding>
        <ScrollView
          style={{ flex: 1 }}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isCasesFetching}
              onRefresh={() => this.getData()}
            />
          }
        >
          <View style={{ marginTop: 20, paddingHorizontal: PADDING_SIZE }}>
            <StyledText size={TEXT_SIZE_15} color={Colors.gray}>Личный кабинет</StyledText>
            <StyledText isTitle style={{ marginTop: MARGIN_TOP_SM }}>Мои дела</StyledText>
          </View>

          {/* <FlatList
            scrollEnabled={false}
            style={{ marginTop: MARGIN_TOP_MD }}
            contentContainerStyle={{ width: SCREEN_WIDTH, alignItems: 'center', paddingVertical: 10 }}
            data={applications}
            // @ts-ignore
            renderItem={({ item }) => this._renderItem(item)}
            keyExtractor={item => item.number}
          /> */}
          <View
            style={{ width: SCREEN_WIDTH, alignItems: 'center', paddingVertical: 10, marginTop: 15 }}
          >
            {applications.map(application => (
              this._renderItem(application)
            ))}
          </View>

          <MainButton
            style={{ width: SCREEN_WIDTH - PADDING_SIZE * 2, alignSelf: 'center', marginTop: 10 }}
            title={`Создать новую заявку`}
            dashed
            onPress={() => this.navigateToCreate()}
          />



       

        </ScrollView>
        {/* <StyledText style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>1.0.1</StyledText> */}
      </MainLayout>
    )
  }
}

export default connect(personalAreaSelector)(PersonalAreaScreen)

const Item = styled.TouchableOpacity`
  width: 100%;
  min-height: 115px;
`

const Status = styled.View`
  /* position: absolute; */
  /* right: 15px; */
  /* top: 20px; */
  width: 50%;
  align-items: flex-end;
`

const CheckImage = styled.Image`
  width: 24px;
  height: 24px;
  position: absolute;
  bottom: 20px;
  right: 20px;
`

const Buttons = styled.View`
  height: 47px;
  flex-direction: row;
  margin-top: 20px;
  border-radius: 40px;
  overflow: hidden;
`

const ButtonInfo = styled.TouchableOpacity`
  flex: 1.5;
  background-color: #1D5ACB;
  align-items: center;
  justify-content: center;
  padding-left: 5px;
`

const RowButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #4A7BD5;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

const ArrowRight = styled.Image`
  width: 7.5px;
  height: 13px;
  position: absolute;
  right: 20px;
`
const IncompleteWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  height: 37px;
  flex-direction: row;
  margin-top: 20px;
  border-radius: 40px;
  overflow: hidden;
`
const IncompleteButton = styled(RowButton)`
  flex: 0.3;
  flex-direction: row;
  /* height: 37px; */
`