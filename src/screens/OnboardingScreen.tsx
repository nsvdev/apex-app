import React from 'react';
import { View } from 'react-native';
import { onboardingSelector } from 'redux/selectors'
import { connect } from 'react-redux'
import {
  StyledText,
  // MainButton,
  // StyledInput,
  TextButton,
  MainLayout
} from 'components';
import styled from 'styled-components/native';
import { PADDING_SIZE, Colors, TEXT_SIZE_15 } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from "pinar";
import { getOnboardingData } from 'redux/actions/onboarding'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

interface Props {
  navigation
  dispatch
  onboardingData: IOnboarding[]
}

class OnboardingScreen extends React.Component<Props> {
  state = {
    currentIndex: 0,
    total: 0 // total pages indexes
  }

  _carouselRef: any;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getOnboardingData())
  }

  _renderContainer(item: IOnboarding) {
    const
      { onboardingData } = this.props
    
      // {uri: item.img}

    return (
      <Container key={item.id} >
        {/* <ImageWrapper> */}
          <Image resizeMode="contain" source={item.img} style={{  }}  />
        {/* </ImageWrapper> */}

        <TextWrapper>
          <Title>{item.title}</Title>
          <Description>{item.subtitle}</Description>
        </TextWrapper>
      </Container>
    )
  }

  nextHandler = () => {
    const
      { navigation } = this.props,
      { currentIndex, total } = this.state

    if (currentIndex == total - 1) {
      navigation.navigate('App')
    } else {
      this._carouselRef.scrollToNext();
    }
  } 

  render() {
    const
      { onboardingData } = this.props,
      { currentIndex } = this.state

    return (
      <MainLayout>
          {onboardingData.length
            ? (
              <Carousel
                showsControls={false}
                onIndexChanged={({index, total}) => this.setState({ currentIndex: index,  total  })}
                ref={carousel => {
                  this._carouselRef = carousel;
                }}
                dotStyle={{
                  backgroundColor: '#E9E4E4',
                  width: 10,
                  height: 10,
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 4,
                  marginBottom: 4,
                  borderRadius: 5
                }}
                activeDotStyle={{
                  backgroundColor: "#4D4D4D",
                  width: 10,
                  height: 10,
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 3,
                  marginBottom: 3,
                  borderRadius: 5
                }}
                dotsContainerStyle={{
                  alignSelf: 'center',
                  flexDirection: "row",
                  bottom: 35
                }}
                style={{ marginBottom: 0 }}
              >
                {onboardingData.map((item: IOnboarding) => this._renderContainer(item))}
              </Carousel>
            )
            : null}

          
      </MainLayout>
    );
  }
}

export default connect(onboardingSelector)(OnboardingScreen)

const Container = styled.View`
  padding-horizontal: 35px;
  flex: 1;
  margin-bottom: 20px; /* dots height */
  min-height: 400px;
  align-items: center;
`;


const TextWrapper = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
const Title = styled(StyledText)`
  font-size: ${RFPercentage(2.6)};
  color: ${Colors.black};
  font-weight: normal;
  text-align: center;
  margin-top: -10px;
`;

const Description = styled(StyledText)`
  font-size: ${RFPercentage(TEXT_SIZE_15)};
  color: #4D4D4D;
  margin-top: 20px;
  text-align: center;
  width: 90%;
`;

const ImageWrapper = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1.5;
  margin-top: 20%;
  border: 1px solid red;
`;

const Image = styled.Image`
  width: 90%;
  height: 100%;
  flex: 1.3;
  margin-top: 10%;
`;

const CountinueWrapper = styled.View`
  right: ${`${PADDING_SIZE}px`};
  bottom: 22px;
  width: 100%;
  align-items: flex-end;
`;