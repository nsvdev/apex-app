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
  route
}

class ApplicationDetailsScreen extends React.Component<Props> {

  state = {
    scrollOffset: 0
  }

  componentDidMount() {
    
  }

  handleScroll = ({ nativeEvent }) => {
    this.setState({ scrollOffset: nativeEvent.contentOffset.y })
  }

  render() {
    const
      { navigation, route } = this.props,
      { scrollOffset } = this.state,
      { application }: { application: IApplication } = route.params;

    return (
      <MainLayout showShadow={scrollOffset > 0} disablePadding>
        <ScrollView
          style={{ flex: 1 }}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: PADDING_SIZE }}
        >
          <View style={{ marginTop: TITLE_TOP }} />
          <StyledText> </StyledText>
          <StyledText isTitle style={{ marginTop: MARGIN_TOP_SM }}>{application.number}</StyledText>

        </ScrollView>
      </MainLayout>
    )
  }
}

export default connect(applicationsSelector)(ApplicationDetailsScreen)
