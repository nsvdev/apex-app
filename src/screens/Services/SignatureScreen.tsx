import React from 'react';
import { Image, View, TouchableOpacity, Modal } from 'react-native';
import styled from 'styled-components/native';
import {
  MainLayout,
  StyledText,
  TotalAmount,
  MainButton,
  StyledInput
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
  PADDING_SIZE,
  MARGIN_TOP_SM,
  MARGIN_TOP_LG,
  SCREEN_WIDTH
} from '../../constants';
import { connect } from 'react-redux'
import { penaltyCreationSelector } from 'redux/selectors';
import { WebView } from 'react-native-webview';
import { ScrollView } from 'react-native-gesture-handler';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import * as FileSystem from 'expo-file-system';
import { isIos } from 'utils';
import Api from 'api';
import { clearPenalty } from 'redux/actions'
import PenaltyCompleteModal from './PenaltyCompleteModal'
import { StackActions } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

interface Props {
  dispatch
  navigation
  penalty: IPenaltyAppilationStore
  route: {
    params: {
      documents: object[]
    }
  }
}

class SignatureScreen extends React.Component<Props> {

  state = {
    allowSend: false,
    base64Image: null,
    completeVisible: false
  }

  sketchRef = React.createRef()

  componentDidMount() {
    const { documents } = this.props.route.params
  }

  onSend = async () => {
    const { documents } = this.props.route.params

    this.sketchRef.getBase64(
      'png',
      true,
      true,
      false,
      false,
      (err, result) => {
        this.setState({ allowSend: false, base64Image: result })

        // sending image base64Image: result
        Api.Services.sendDocuments(documents, result)
          .then(res => {
            // this.props.dispatch(clearPenalty())
            this.setState({ completeVisible: true })
          })

        setTimeout(() => {
          this.setState({ allowSend: true })
        }, 1000);
      })

    // const prefix = isIos ? SketchCanvas.MAIN_BUNDLE : 'storage/sdcard0/Pictures/'
    // const url = `${prefix}/signature.png`
    // const df = FileSystem.readAsStringAsync(url)
    // console.log(df)
  }

  render() {
    const
      { navigation } = this.props,
      { allowSend, base64Image } = this.state;

    return (
      <MainLayout>
        <StyledText size={TEXT_SIZE_15} color={Colors.gray} style={{ marginTop: TITLE_TOP }}> </StyledText>
        <StyledText isTitle style={{ marginTop: MARGIN_TOP_SM }}>Ваша подпись</StyledText>
        <StyledText color={Colors.gray} style={{ marginTop: MARGIN_TOP_MD, width: '70%' }}>
          Пожалуйста распишитесь пальцем в области на экране
        </StyledText>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            borderWidth: 1,
            marginTop: MARGIN_TOP_MD,
            marginBottom: 55,
            borderRadius: 10,
            borderColor: Colors.blue,
            borderStyle: 'dashed',
            backgroundColor: Colors.grayLight
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.sketchRef.clear()
              this.setState({ allowSend: false })
            }}
            style={{ width: 24, height: 21, position: 'absolute', right: 20, top: 20, zIndex: 999 }}
          >
            <Image
              style={{ width: '100%', height: '100%' }}
              source={require('assets/images/reset.png')}
            />
          </TouchableOpacity>

          <SketchCanvas
            ref={node => this.sketchRef = node}
            style={{ flex: 1 }}
            strokeColor={Colors.blue}
            strokeWidth={3}
            onStrokeStart={() => this.setState({ allowSend: true })}
          />
        </View>

        <MainButton
          style={{ bottom: 25, backgroundColor: 'white', borderWidth: 0.5, borderColor: Colors.gray }}
          title={`Отправить в ГосУслуги`}
          onPress={() => this.onSend()}
          textStyle={{ color: Colors.blue }}
          gosUslugi
          disabled={!allowSend}
        />

        
        <Modal
          visible={this.state.completeVisible}
          animationType={`slide`}
        >
          <PenaltyCompleteModal
            onClose={() => {
              this.setState({ completeVisible: false }, () => {
                this.props.dispatch(clearPenalty())
                navigation.dispatch(StackActions.popToTop());
              })
            }}
            toPersonalArea={() => {
              this.setState({ completeVisible: false }, () => {
                this.props.dispatch(clearPenalty())

                navigation.dispatch(StackActions.popToTop());

                const jumpToAction = DrawerActions.jumpTo('PersonalArea');
                navigation.dispatch(jumpToAction);
              })
              
            }}
          />
        </Modal>

      </MainLayout>
    )
  }
}

export default connect(penaltyCreationSelector)(SignatureScreen)