import React from 'react';
import styled from 'styled-components/native';
import { Colors, DESCRIPTION_TOP, PADDING_SIZE, TITLE_TOP } from '../constants';
import { StyledText } from 'components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Linking } from 'react-native';

class AboutServiceScreen extends React.Component {

  componentDidMount() {}

  render() {
    return (
      <Container>
        <StyledText isTitle style={{ marginTop: TITLE_TOP }}>О сервисе</StyledText>

        <StyledText style={{ marginTop: DESCRIPTION_TOP }}>
        {`APEXCOM - Это платформа, которая поможет рассчитать сумму неустойки по договору долевого участия и заполнить форму для составления заявки.\n
Наши контакты:`}
        </StyledText>
        
        <TouchableOpacity onPress={() => Linking.openURL(`tel:+79032233508`)}>
          <StyledText style={{ marginTop: 10 }} >
            +79032233508
          </StyledText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(`mailto:info@law-app.ru`)}>
          <StyledText style={{ marginTop: 3 }} >
            info@law-app.ru
          </StyledText>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default AboutServiceScreen

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${Colors.background};
  padding-horizontal: ${`${PADDING_SIZE}px`};
`;
