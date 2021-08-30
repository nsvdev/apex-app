import React from 'react';
import { Image, View } from 'react-native';
import styled from 'styled-components/native';
import {
  MainLayout,
  StyledText,
  TotalAmount,
  MainButton,
  StyledInput,
  TextButton
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
  TEXT_SIZE_16,
  PADDING_SIZE,
  MARGIN_TOP_SM,
  MARGIN_TOP_LG,
  SCREEN_WIDTH
} from '../../constants';
import { connect } from 'react-redux'
import { penaltyCreationSelector } from 'redux/selectors';
import { ScrollView } from 'react-native-gesture-handler';
import * as FileSystem from 'expo-file-system';
import { isIos } from 'utils';

interface Props {
  dispatch
  onClose
  toPersonalArea
}

class PenaltyCompleteModal extends React.Component<Props> {

  state = {
    
  }

  componentDidMount() {

  }

  onClose = () => {
    this.props.onClose()
  }

  render() {
    const {  } = this.state;

    return (
      <MainLayout>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Header>
            <Logo
              source={require('assets/images/logo.png')}
              resizeMode={'contain'}
            />
            <Close onPress={() => this.onClose()}>
              <CloseImage source={require('assets/images/close_blue.png')} />
            </Close>
          </Header>

          <Image
            resizeMode={`contain`}
            style={{ width: '80%', height: '40%', marginTop: '15%' }}
            source={require('assets/images/complete-image.png')}
          />

          <StyledText isTitle style={{ marginTop: MARGIN_TOP_LG }}>Отлично!</StyledText>

          <StyledText size={TEXT_SIZE_16} style={{ marginTop: MARGIN_TOP_MD }}>Заявка №{this.props.penalty.id}</StyledText>
          <StyledText size={TEXT_SIZE_16}>успешно отправлена</StyledText>

          <StyledText color={Colors.grayDark} style={{ width: '80%',  marginTop: MARGIN_TOP_MD  }} centered>
            Заявка отправлена на проверку. Вы можете отслеживать статус заявки в
          </StyledText>
          <TextButton
            title={`личном кабинете`}
            onPress={() => this.props.toPersonalArea()}
            textColor={Colors.blue}
          />

          <TextButton
            style={{ position: 'absolute', bottom: 25, alignSelf: 'center' }}
            textColor={Colors.blue}
            onPress={() => this.onClose()}
            title={`Закрыть`}
            textSize={TEXT_SIZE_16}
          />
        </View>
      </MainLayout>
    )
  }
}

export default connect(penaltyCreationSelector)(PenaltyCompleteModal)

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 50px;
  align-items: center;
  width: ${SCREEN_WIDTH - PADDING_SIZE * 2};
`
const Logo = styled.Image`
  width: 110px;
  /* height: 14px; */
`
const Close = styled.TouchableOpacity`
  
`
const CloseImage = styled.Image`
  width: 20px;
  height: 20px;
`