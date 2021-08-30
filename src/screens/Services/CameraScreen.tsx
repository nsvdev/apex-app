import React from 'react';
import { FlatList, Text, View, TouchableOpacity, Image, StatusBar, Alert, SafeAreaView, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import styled from 'styled-components/native';
import { TextButton, StyledText } from 'components';
import { Colors, TEXT_SIZE_15, Fonts, TEXT_SIZE_12, PADDING_SIZE, SCREEN_WIDTH } from '../../constants';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import MaskedView from '@react-native-community/masked-view';
import ImageEditor from "@react-native-community/image-editor";
import * as ImageManipulator from "expo-image-manipulator";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33]
const BACKGROUND_COLOR = __DEV__ ? 'red' : 'rgba(0, 0, 0, 0.6)'
const HEAD_MASK_HEIGHT = 40

interface Props {
  dispatch
  navigation
  route
}

class CameraScreen extends React.Component<Props> {

  state = {
    images: [],
    croppedImage: null,
    hasPermission: null,
    type: Camera.Constants.Type.back
  }

  cameraRef = React.createRef();

  componentDidMount() {
    const
      { route } = this.props,
      { images } = route.params;

    this.setState({ images })

    this.getAccess()
  }

  getAccess = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' })
  }

  pickImage = async () => {
    if (this.state.images.length === items.length && !this.singlePicture()) {
      Alert.alert('Предупреждение', `Вы уже загрузили ${items.length} фотографии`)
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [6, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      let images = this.singlePicture() ? [] : this.state.images

      images.push({ uri: result.uri })

      this.setState({ images }, () => {
        if (this.singlePicture()) {
          this.props.route.params.setImages(images)
          this.props.navigation.goBack()
        }
      })
    }
  }

  /** ксли можно сделать толькло 1 фото */
  singlePicture = () => {
    const
      { navigation, route } = this.props,
      { title, setImages, documentID } = route.params;

    return documentID === 4 || documentID === 5 || documentID === 3 || documentID === 2
  }

  takePicture = async () => {

    const result = await this.cameraRef.takePictureAsync();

    let images = this.singlePicture() ? [] : this.state.images
    
    // let cropData = {
    //   offset: {x: 20, y: 60},
    //   size: {width: result.width, height: result.height},
    //   // displaySize: {width: 100, height: 200},
    //   resizeMode: 'cover',
    // };
    // let cropedUrl = await ImageEditor.cropImage(result.uri, cropData)

    // let rotatedResult = await ImageManipulator.manipulateAsync(
    //   cropedUrl,
    //   [{ rotate: 180 }, { flip: ImageManipulator.FlipType.Horizontal }],
    //   { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    // );


    // const cropData2 = {
    //   offset: {x: 20, y: 160},
    //   size: {width: result.width, height: result.height},
    //   // displaySize: {width: 100, height: 200},
    //   resizeMode: 'cover',
    // };
    // const cropedUrl2 = await ImageEditor.cropImage(rotatedResult.uri, cropData2)


    // const rotatedResult2 = await ImageManipulator.manipulateAsync(
    //   cropedUrl2,
    //   [{ rotate: 180 }, { flip: ImageManipulator.FlipType.Horizontal }],
    //   { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    // );

    // images.push({ uri: rotatedResult2.uri })

    if (images.length === items.length && !this.singlePicture()) {
      Alert.alert('Предупреждение', `Вы уже загрузили ${items.length} фотографии`)
      return
    } else {
      images.push({ uri: result.uri })
    }
    

    this.setState({ images }, () => {
      if (this.singlePicture()) {
        this.props.route.params.setImages(images)
        this.props.navigation.goBack()
      }
    })
    
    // let images = this.singlePicture() ? [] : this.state.images
    // images.push({ uri: result.uri })
    
  }

  removeItem = (index) => {
    let images = this.state.images
    images.splice(index, 1)
    this.setState({ images })
  }

  render() {
    const
      { navigation, route } = this.props,
      { title, setImages, documentID } = route.params,
      { images, hasPermission } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'black',
          }}
        >
          <Camera
            ref={node => { this.cameraRef = node }}
            style={{ flex: 1 }}
            type={this.state.type}
            ratio={'16:9'}
          >
          {/* <StatusBar /> */}

          {/* <View style={{
            backgroundColor: BACKGROUND_COLOR,
            position: 'absolute',
            top: 0,
            width: SCREEN_WIDTH - PADDING_SIZE * 2,
            alignSelf: 'center',
            height: 63,
            }}
          /> */}

          <View
            style={{
              backgroundColor: BACKGROUND_COLOR,
              position: 'absolute',
              top: 0,
              width: '100%',
              height: HEAD_MASK_HEIGHT + HEAD_MASK_HEIGHT / 2,
              marginHorizontal: PADDING_SIZE,
              zIndex: 999
            }}
          />

          <View style={{ backgroundColor: BACKGROUND_COLOR, position: 'absolute', left: 0, height: '100%', width: 20 }} />
          <View style={{ backgroundColor: BACKGROUND_COLOR, position: 'absolute', right: 0, top: HEAD_MASK_HEIGHT, height: '100%', width: 20 }} />

          <View style={{ backgroundColor: BACKGROUND_COLOR, position: 'absolute', bottom: 0, width: SCREEN_WIDTH - PADDING_SIZE * 2, alignSelf: 'center', height: 164 }} />

          <View
            style={{
              flex: 1,
              paddingBottom: 160,
              // backgroundColor: 'red'
            }}
          >
            <View style={{ marginTop: 15, alignSelf: 'center', width: '80%', zIndex: 999 }}>
              <StyledText
                color={'white'}
                style={{width: '80%', alignSelf: 'center' }}
                size={TEXT_SIZE_12}
                centered
                lineHeight={2.1}
              >
                {title}
              </StyledText> 
            </View>
            


            <CameraMask>

            </CameraMask>
            


            <ScrollWrapper>
              {this.singlePicture() ? null :
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingLeft: 17.5,
                    paddingRight: 17.5
                  }}
                >
                  {items.map((item, i) => 
                    images[i] ? (
                      <Item>
                        <ItemImage
                          source={{ uri: images[i].uri }}
                          resizeMode={'cover'}
                        />
                        <TrashButton onPress={() => this.removeItem(i)}>
                          <TrashImage
                            source={require('assets/images/icons/trash-red.png')}
                          />
                        </TrashButton>
                        
                      </Item>
                    ) : (
                      <EmptyItem>

                      </EmptyItem>
                    )
                  )}
                </ScrollView>
              }
            </ScrollWrapper>
            


            <Footer>
              <TouchableOpacity
                onPress={() => {
                  setImages(images)
                  navigation.goBack()
                }}
                style={{
                  position: 'absolute',
                  left: 20,
                  bottom: 30
                }}
              >
                <Image
                  source={require('assets/images/back-white.png')}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>

              <Button onPress={() => this.takePicture()}>
                <ButtonCitcle />
              </Button>

              <TextButton
                style={{ position: 'absolute', right: 20, bottom: 30 }}
                title={`Из галереи`}
                onPress={() => this.pickImage()}
                textColor={'white'}
                textSize={2.3}
                textProps={{ style: { fontWeight: '500', fontFamily: Fonts.medium } }}
              />

            </Footer>
            
          </View>
        </Camera>
      </View>
      </SafeAreaView>
      
    )
  }
}

export default CameraScreen

const Footer = styled.View`
  position: absolute;
  bottom: 0px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
`

const Button = styled.TouchableOpacity`
  border: 5px solid white;
  border-radius: 100px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`

const ButtonCitcle = styled.View`
  width: 80%;
  height: 80%;
  border-radius: 100px;
  background-color: white;
`

const CameraMask = styled.View`
  width: 100%;
  flex: 1;
  width: ${`${SCREEN_WIDTH - PADDING_SIZE * 2}px`};
  /* border-radius: 20px; */
  /* background-color: red; */
  margin-top: 20px;
  align-self: center;
  overflow: hidden;
  /* border: 10px solid rgba(0, 0, 0, 0.3); */
`

const ScrollWrapper = styled.View`
  width: 100%;
  /* background-color: red; */
  position: absolute;
  bottom: 80px;
`

const EmptyItem = styled.View`
  height: 65px;
  width: 58px;
  border-style: dashed;
  border-width: 1px;
  border-color: #FFFFFF;
  border-radius: 5px;
  /* background-color: green; */
  margin-left: 2.5px;
  margin-right: 2.5px;
`

const Item = styled(EmptyItem)`
  border-width: 0px;
`



const TrashButton = styled.TouchableOpacity`
  width: 10.5px;
  height: 13.5px;
  position: absolute;
  right: 7.5px;
  top: 6px;
`
const TrashImage = styled.Image`
  width: 100%;
  height: 100%;
`


const ItemImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 5px;
`