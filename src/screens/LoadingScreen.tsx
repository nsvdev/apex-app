import React from 'react';
import styled from 'styled-components/native';
import { connect } from 'react-redux'
import { loadingSelector } from 'redux/selectors';

interface Props {
  navigation
  showOnboarding: IOnboarding
  user: IUserStore
}

class LoadingScreen extends React.Component<Props> {

  componentDidMount() {
    const { navigation, user, showOnboarding } = this.props;
    if (showOnboarding) {
      navigation.navigate('Onboarding')
    } else {
      navigation.navigate('App')
    }
  }

  render() {
    return (
      <Container>

      </Container>
    );
  }
}

export default connect(loadingSelector)(LoadingScreen)

const Container = styled.View`
  
`;