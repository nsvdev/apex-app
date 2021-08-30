import React from 'react';
import styled from 'styled-components/native';
import { Colors, DESCRIPTION_TOP, PADDING_SIZE, TITLE_TOP } from '../constants';
import { StyledText } from 'components';
import { TouchableOpacity } from 'react-native-gesture-handler';

class LegalInformation extends React.Component {

  componentDidMount() {}

  render() {
    return (
      <Container>
        <StyledText isTitle style={{ marginTop: TITLE_TOP }}>Правовая информация</StyledText>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('PrivacyPolicy')}>
          <StyledText style={{ marginTop: DESCRIPTION_TOP, color: Colors.blue }} size={2.4}>
            {`Политика конфиденциальности`}
          </StyledText>
        </TouchableOpacity>
        
      </Container>
    );
  }
}

export default LegalInformation

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${Colors.background};
  padding-horizontal: ${`${PADDING_SIZE}px`};
`;
