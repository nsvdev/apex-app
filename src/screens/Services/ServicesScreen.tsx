import React from 'react';
import { FlatList, Text, View } from 'react-native';
import styled from 'styled-components/native';
import { MainLayout, StyledText } from 'components';
import { TITLE_TOP, DESCRIPTION_TOP, Colors, TEXT_SIZE_15 } from '../../constants';
import { connect } from 'react-redux'
import { servicesSelector } from 'redux/selectors';
import { getServices, setPenalty } from 'redux/actions';
import { ScrollView } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface Props {
  services: IServicesStore
  dispatch
  navigation
}

const hintTitle = 'Внимание!'
const hintDescription = 'В соответствии с постановлением Правительства № 423 от 2 апреля 2020 г. в период с 03 апреля 2020 г. по 01 января 2021 г. неустойка за неисполнение обязательств застройщиком не начисляется в связи с развитием коронавирусной инфекции (Covid-2019). При расчете размера неустойки застройщика положения данного нормативного акта учтены.'

class ServicesScreen extends React.Component<Props> {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getServices())
  }

  navigate = (service) => {
    const { navigation, dispatch } = this.props;

    dispatch(setPenalty({ hintTitle, hintDescription }))
    navigation.navigate('PenaltyCalculation', { service })
  }
  
  _renderItem = ({ item }: { item: IService }) => {
    
    const images = [
      require(`../../assets/images/service_image_1_1.png`),
      require(`../../assets/images/service_image_2_1.png`),
      require(`../../assets/images/service_image_3_1.png`),
      require(`../../assets/images/service_image_4_1.png`)
    ]
    const icons = [
      require(`../../assets/images/service_image_1_2.png`),
      require(`../../assets/images/service_image_2_2.png`),
      require(`../../assets/images/service_image_3_2.png`),
      require(`../../assets/images/service_image_4_2.png`)
    ]

    return (
      <ServiceItem
        disabled={!item.is_active}
        onPress={() => this.navigate(item)}
      >
        <ImagesWrapper>
          <View>
            <LargeImage source={images[item.id - 1]} />
            <SmallImage source={icons[item.id - 1]} />
          </View>
        </ImagesWrapper>
        <StyledText
          size={TEXT_SIZE_15}
          style={{
            marginLeft: 15,
            width: '60%',
            color: !item.is_active ? Colors.gray : Colors.black
          }}>
            {item.id !== 1 ?  item.name : 'Получение неустойки по договору долевого участия'}
        </StyledText>
      </ServiceItem>
  )}

  render() {
    const { inActiveData, activeData} = this.props.services;

    return (
      <MainLayout>
        <ScrollView style={{ minHeight: '100%' }}>

       
          <StyledText isTitle style={{ marginTop: TITLE_TOP }}>Услуги</StyledText>

          <FlatList
            scrollEnabled={false}
            style={{ marginTop: DESCRIPTION_TOP }}
            data={activeData}
            renderItem={this._renderItem}
            keyExtractor={(item: any) => item.id}
          />

          {inActiveData.length ? (
            <SoonContainer>
              <SoonTitle>Скоро:</SoonTitle>

              <FlatList
                scrollEnabled={false}
                style={{ marginTop: DESCRIPTION_TOP }}
                data={inActiveData}
                renderItem={this._renderItem}
                keyExtractor={(item: any) => item.id}
              />
            </SoonContainer>
          ) : null}
         </ScrollView>
      </MainLayout>
    );
  }
}

export default connect(servicesSelector)(ServicesScreen)

const Container = styled.View`
  
`;

const ServiceItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: 15px;
`;

const SoonContainer = styled.View`
  margin-top: 15px;
`;
const SoonTitle = styled(StyledText)`
  color: ${Colors.gray};
  font-size: ${RFPercentage(TEXT_SIZE_15)}
`;

const ImagesWrapper = styled.View`
  position: relative;
  width: 55px;
  height: 55px;
`;

const LargeImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 27.5px;
`;
const SmallImage = styled.Image`
  width: 30px;
  height: 30px;
  position: absolute;
  right: -2px;
  bottom: -3px;
  border-radius: 15px;
`;