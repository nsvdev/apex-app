import React from 'react';
import styled from 'styled-components/native';
import { MainLayout, StyledText, TextButton, MainButton } from 'components';
import { TITLE_TOP, DESCRIPTION_TOP, Colors } from 'constants';
import { connect } from 'react-redux'
import { servicesSelector } from 'redux/selectors';

interface Props {
  navigation
  route
  token: string,
}

class ServiceDetailsScreen extends React.Component<Props> {

  componentDidMount() {

  }

  navigate = () => {
    const
      { route, navigation, token } = this.props;
      // service: IService = route.params.service;
    if (token) {
      navigation.navigate('PenaltyCreation')
      // navigation.navigate('Auth')
    } else {
      // navigation.jumpTo('Auth')
      navigation.navigate('Auth')
    }
  }

  render() {
    const
      { navigation, route } = this.props;
      // service: IService = route.params.service;

    return (
      <MainLayout>
          <StyledText isTitle style={{ marginTop: TITLE_TOP, width: '90%' }}>
            {/* {service.name} */}
            Получение неустойки по договору долевого участия
          </StyledText>
          <StyledText size={3} style={{ marginTop: DESCRIPTION_TOP, width: '90%' }}>
            {/* {service.detail_name} */}
            Получение неустойки по договору долевого участия со строительной компании
          </StyledText>

          <StyledText style={{ marginTop: `7%`, width: '90%' }}>
            {/* {service.description} */}
            Для взыскания неустойки необходимо обратиться в суд с заявлением о ее взыскании. Далее Вам необходимо будет определиться с пакетом услуг. В зависимости от выбранного пакета услуг, мы либо подготовим для Вас в полном объеме текст заявления, с которым Вы сможете обратиться в суд самостоятельно, либо мы реализуем весь комплекс услуг по взысканию долга под ключ
          </StyledText>

          <BottomWrapper>
            {/*
            <TextButton
              style={{ marginBottom: 20 }}
              textProps={{ style: { fontWeight: '700' } }}
              title={`Рассчитать неустойку`}
              textColor={Colors.blue}
              onPress={() => console.log(navigation.navigate('PenaltyCalculation'))}
            />
            */}
            <MainButton
              title={`Создать заявку`}
              onPress={this.navigate}
            />
          </BottomWrapper>
      </MainLayout>
    );
  }
}

export default connect(servicesSelector)(ServiceDetailsScreen)

const Container = styled.View`
  
`;

const BottomWrapper: any = styled.View`
  width: 100%;
  align-items: center;
  position: absolute;
  bottom: 0px;
  padding-vertical: 20px;
  align-self: center;
  background-color: white;
`;