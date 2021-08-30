import React from 'react';
import { FlatList, Text, View, ScrollView } from 'react-native';
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
import { applicationsSelector } from 'redux/selectors';
import { getApplications } from 'redux/actions';
import { ApplicationStatusIDs } from 'constants/enums'

interface Props {
  dispatch
  navigation
  applications: IApplication[]
}

class ApplicationsScreen extends React.Component<Props> {

  state = {
    scrollOffset: 0
  }

  componentDidMount() {
    this.props.dispatch(getApplications())
  }

  handleScroll = ({ nativeEvent }) => {
    this.setState({ scrollOffset: nativeEvent.contentOffset.y })
  }

  getStatus = (item: IApplication) => {
    let statusText = ''
    let statusColor = '#000000'
    switch (item.statuses[item.statuses.length - 1].id) {
      case ApplicationStatusIDs.Sended:
        statusText = item.statuses[item.statuses.length - 1].title
        statusColor = '#666666'
        break;
      default:
        statusText = item.statuses[item.statuses.length - 1].title
        break;
    }

    return (
      <Status>
        <StyledText color={statusColor} size={TEXT_SIZE_11}>
          {statusText}
        </StyledText>
      </Status>
    )
  }

  navigateToDetails = (application: IApplication) => {
    this.props.navigation.navigate('ApplicationDetails', { application })
  }

  _renderItem = (item: IApplication) => (
    <Item
      onPress={() => this.navigateToDetails(item)}
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

        backgroundColor: item.statuses[item.statuses.length - 1].id === ApplicationStatusIDs.WaitingDocuments ? "#FFC212" : 'white',
        margin: 2.5,
        padding: 20
      }}
    >
      <View style={{ width: '60%' }}>
        <StyledText bold size={TEXT_SIZE_15}>{item.number}</StyledText>
        {item.statuses[item.statuses.length - 1].id !== ApplicationStatusIDs.Incomplete ? (
          <StyledText size={TEXT_SIZE_15} numberOfLines={2}>{item.ddu}</StyledText>
        ) : null}
      </View>

      {/* {this.getStatus(item)} */}

      {item.statuses[item.statuses.length - 1].id === ApplicationStatusIDs.WaitingDocuments ? (
        <Buttons>
          <ButtonInfo>
            <StyledText size={TEXT_SIZE_11} color={`white`}>Вы должны передать нам оригиналы документов</StyledText>
          </ButtonInfo>
          <RowButton onPress={() => alert('...')}>
            <StyledText style={{ width: '80%' }} size={TEXT_SIZE_11} color={`white`}>Назначить встречу</StyledText>
            <ArrowRight source={require('assets/images/icons/arrow-right.png')} />
          </RowButton>
        </Buttons>
      ) : null}

      {item.statuses[item.statuses.length - 1].id === ApplicationStatusIDs.MoneySent ? (
        <CheckImage source={require('assets/images/icons/circle-check.png')} />
      ) : null}

      {item.statuses[item.statuses.length - 1].id === ApplicationStatusIDs.Incomplete ? (
        <IncompleteWrapper>
          <ButtonInfo>
            <StyledText color={'white'} size={TEXT_SIZE_11}>Незаполнена. Заполнить заявку.</StyledText>
          </ButtonInfo>
          <IncompleteButton>
            <ArrowRight source={require('assets/images/icons/arrow-right.png')} />
          </IncompleteButton>          
        </IncompleteWrapper>
      ) : null}
    </Item>
  )

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
        >
          <View style={{ marginTop: TITLE_TOP, paddingHorizontal: PADDING_SIZE }}>
            <StyledText size={TEXT_SIZE_15} color={Colors.gray}>Личный кабинет</StyledText>
            <StyledText isTitle style={{ marginTop: MARGIN_TOP_SM }}>Мои дела</StyledText>
          </View>

          <FlatList
            scrollEnabled={false}
            style={{ marginTop: MARGIN_TOP_MD }}
            contentContainerStyle={{ width: SCREEN_WIDTH, alignItems: 'center', paddingVertical: 10 }}
            data={applications}
            // @ts-ignore
            renderItem={({ item }) => this._renderItem(item)}
            keyExtractor={item => item.number}
          />

          <MainButton
            style={{ width: SCREEN_WIDTH - PADDING_SIZE * 2, alignSelf: 'center', marginTop: 10 }}
            title={`Создать новую заявку`}
            dashed
            onPress={() => alert('...')}
          />

        </ScrollView>
      </MainLayout>
    )
  }
}

export default connect(applicationsSelector)(ApplicationsScreen)

const Item = styled.TouchableOpacity`
  width: 100%;
`

const Status = styled.View`
  position: absolute;
  right: 20px;
  top: 20px;
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

const ButtonInfo = styled.View`
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
  height: 37px;
`