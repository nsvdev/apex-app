import React from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
  PermissionsAndroid,
  Platform,
  Text,
  Linking
} from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import styled from 'styled-components/native';
import {
  MainLayout,
  StyledText,
  TotalAmount,
  MainButton,
  TextButton,
} from 'components';
import {
  TITLE_TOP,
  DESCRIPTION_TOP,
  Colors,
  MARGIN_TOP_MD,
  TEXT_SIZE_11,
  TEXT_SIZE_12,
  TEXT_SIZE_13,
  TEXT_SIZE_14,
  TEXT_SIZE_15,
  TEXT_SIZE_16,
  PADDING_SIZE,
  MARGIN_TOP_SM,
  MARGIN_TOP_LG,
  SCREEN_WIDTH,
  TITLE_SIZE
} from '../../constants';
import { connect } from 'react-redux'
import { applicationsSelector } from 'redux/selectors';
import { getApplications, setPenalty } from 'redux/actions';
import { ApplicationStatusIDs } from 'constants/enums'
import moment from 'moment'
import * as DocumentPicker from 'expo-document-picker';
import Api from 'api';
import * as FileSystem from 'expo-file-system'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { errorHandler, statusTime } from 'utils';
import RNFetchBlob from 'rn-fetch-blob'
import * as Permissions from 'expo-permissions';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const hintTitle = 'Внимание!'
const hintDescription = 'В соответствии с постановлением Правительства № 423 от 2 апреля 2020 г. в период с 03 апреля 2020 г. по 01 января 2021 г. неустойка за неисполнение обязательств застройщиком не начисляется в связи с развитием коронавирусной инфекции (Covid-2019). При расчете размера неустойки застройщика положения данного нормативного акта учтены.'

interface Props {
  dispatch
  navigation
  route
}

let del = false

const docHeight = 130

class ApplicationDetailsScreen extends React.Component<Props> {

  state = {
    scrollOffset: 0,
    documentsShown: false,
    animationHeight: new Animated.Value(50),
    documentsHeight: 50,
    documents: [],
    sum: 0,
    statuses: [],
    showToast: false,
    allowDelete: false
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({
    //     documents: DOCUMENTS,
    //     documentsHeight: DOCUMENTS.length ? (DOCUMENTS.length * 130) + 80 + openedHeight : openedHeight // plus padding 15 + 15 + min height (50)
    //   })
    // }, 400);
    this.fetchData()

    setTimeout(() => {
      this.fetchData()
    }, 1500);
  }

  fetchData = async () => {
    const { application }: { application: IApplication } = this.props.route.params;
    const result = await Api.PersonalArea.getApplicationById(application.id)
    const data: IApplicationDetails = result.data.data
    
    console.log('data: ', data)

    console.log('docs: ', data.docs)

    this.setState({
      documents: data.docs,
      sum: String(data.sum).split('.')[0] || data.sum,
      // @ts-ignore
      statuses: data.statuses,
      documentsHeight: data.docs.length ? data.docs.length * 150 : 50
    })
  }

  handleScroll = ({ nativeEvent }) => {
    this.setState({ scrollOffset: nativeEvent.contentOffset.y })
  }

  hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  downloadFile = async (url) => {
    const androidPermission = await this.hasAndroidPermission()

    if (Platform.OS === "android" && !androidPermission) {
      return;
    }

    console.log('url:', url)
    /**
    const downloadResumable = FileSystem.createDownloadResumable(
      document.url,
      FileSystem.documentDirectory + `${document.id}.pdf`,
      {},
      () => console.log('downloading...')
    );

    const { uri } = await downloadResumable.downloadAsync();
    console.log('Finished downloading to ', uri);
    */

    if (Platform.OS === 'ios') {
      CameraRoll.save(url)
        .then(() => {
          Alert.alert('Успешно', 'Документ успешно сохранен в галерею')
        }) 
        .catch(err => {
          console.log('err:', err)
        })
    } else {
      let newImgUri = url.lastIndexOf('/');
      let imageName = url.substring(newImgUri);

      let dirs = RNFetchBlob.fs.dirs;
      let path = Platform.OS === 'ios' ? dirs['MainBundleDir'] + imageName : dirs.PictureDir + imageName;

      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'jpg',
        indicator: true,
        IOSBackgroundTask: true,
        path: path,
        addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: path,
            description: 'Image'
          },
      })
        .fetch('GET', url)
          .then(res => {
            Alert.alert('Успешно', 'Документ успешно сохранен в галерею')
            return
          })
          .catch(err => {
            // alert(err)
            console.log('err:', err)
          })
    }

   
   
  }

  removeAlert = (appilation: IApplication) => {
    Alert.alert(
      "Удаление заявки",
      `Вы действительно хотите удалить заявку №${appilation.number.match(/\d+/)}?`,
      [
        {
          text: "Удалить",
          onPress: () => this.removeApplication(appilation.id),
          style: "destructive"
        },
        { text: "Отмена", onPress: null }
      ],
      { cancelable: false }
    );
  }

  removeApplication = (appilationID) => {
    // console.log(appilationID)

    this.setState({ showToast: true })
    del = true

    setTimeout(() => {
      this.setState({ showToast: false })

      if (del) {
        del = false
        Api.Services.deleteApplication(appilationID)
          .then(res => {
            this.props.dispatch(getApplications())
            this.props.navigation.goBack()
          })
          .catch(err => {
            errorHandler(err)
          })

        
      }
    }, 5000);
  }

  toggleDocuments = () => {
    setTimeout(() => {
      this.setState({ documentsShown: !this.state.documentsShown })
    }, this.state.documentsShown ? 0 : 200);
    
    // this.state.animationHeight.setValue(0)

    Animated.timing(
      this.state.animationHeight,
      {
          toValue: this.state.documentsShown ? 50 : (this.state.documents.length ? this.state.documentsHeight + 110 : 160),
          duration: 200
      }
    ).start()
    
  }

  addDocument = () => {
    // DocumentPicker.getDocumentAsync({})
    //   .then(res => {
    //     // TODO POST to Api
    //     if (res.uri) {
    //       this.setState({
    //         documents: [...this.state.documents, { url: res.uri, name: res.name }],
    //         documentsHeight: this.state.documentsHeight + 160
    //       }, () => {
    //         Animated.timing(
    //           this.state.animationHeight,
    //           {
    //               toValue: this.state.documentsHeight + 60,
    //               duration: 200
    //           }
    //         ).start()
    //       })
    //     }
    //   })

    this.props.navigation.navigate('Camera', {
      documentID: 2,
      images: [],
      setImages: (images) => {
        if (images.length) {
          Api.Services.sendDocuments([{
            images: [{
              uri: images[0].uri,
              name: '',
              type: 'image/jpeg'
            }]
          }], null, true, this.state.documents.length + 1)
            .then(res => {
              console.log('documents was successfully sended')
              this.fetchData()
  
              setTimeout(() => {
                this.setState({
                  documentsHeight: this.state.documentsHeight + 110
                }, () => {
                  setTimeout(() => {
                    Animated.timing(
                      this.state.animationHeight,
                      {
                          toValue: this.state.documentsHeight,
                          duration: 200
                      }
                    ).start()
                  }, 450);
                  
                })
              }, 450);
            })
            .catch(err => {
              console.log(err)
              errorHandler(err)
            })
        }
      }
    })
  }

  removeDocument = (id) => {
    const { application }: { application: IApplication } = this.props.route.params;

    Api.Services.deleteDocument(application.id, [id])
      .then(res => {
        this.fetchData()

        setTimeout(() => {
          Animated.timing(
            this.state.animationHeight,
            {
                toValue: this.state.documents.length ? this.state.documentsHeight + 120 : 160,
                duration: 200
            }
          ).start()
        }, 600);
      })
      .catch(err => {
        errorHandler(err)
      })
  }

  _renderDocument = (item) => (
    <View
      key={item.id}
      style={{
        width: '100%',
        height: docHeight,
        paddingHorizontal: 20,
        backgroundColor: Colors.grayLight,
        marginVertical: 5
      }}
    >
      <View style={{ marginTop: 20, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
        <View style={{ width: '50%' }}>
          <StyledText lineHeight={2.4} numberOfLines={2} >{item.name}</StyledText>
          <View style={{flexDirection: 'row' }}>
            <StyledText size={TEXT_SIZE_11} color={Colors.gray} style={{ marginTop: 5 }}>
              {/* {`${item.type}, ${item.size} MB`} */}
            </StyledText>
          </View>
          
        </View>

        <TouchableOpacity
          onPress={() => this.removeDocument(item.id)}
        >
          <Image
            source={require('assets/images/icons/trash-gray.png')}
            style={{ width: 14, height: 18 }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', position: 'absolute', bottom: 20, left: 20 }}>
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={() => this.downloadFile(item.url)}
        >
          <Image
            source={require('assets/images/icons/arrow-download.png')}
            style={{ width: 14, height: 19 }}
          />
          <StyledText style={{ marginLeft: 10 }}>Скачать</StyledText>
        </TouchableOpacity>
       
        {/* <TouchableOpacity
          style={{ flexDirection: 'row', marginLeft: 20 }}
        >
          <Image
            source={require('assets/images/icons/upload.png')}
            style={{ width: 17, height: 21 }}
          />
          <StyledText style={{ marginLeft: 10 }}>Переслать</StyledText>
        </TouchableOpacity> */}
        
      </View>
    </View>
  )

  render() {
    const
      { navigation, route } = this.props,
      { scrollOffset, documentsShown, documents, documentsHeight, sum, statuses, showToast } = this.state,
      { application }: { application: IApplication } = route.params;


    console.log(application.statuses)

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

          <View style={{ marginTop: MARGIN_TOP_SM }} />
          <Header>
            <StyledText isTitle>{application.number}</StyledText>

            <TextButton
              textColor="#1D5ACB"
              onPress={() => {
                this.props.navigation.navigate('PenaltyCreation', {
                  editing: true,
                  application,
                  onSave: () => this.fetchData(),
                  sum: this.state.sum
                })
              }}
              title="Редактировать"
              textSize={TEXT_SIZE_11 - 0.2}
              style={{ position: 'absolute', right: 0, bottom: 2 }}
            />
          </Header>
          

          <View style={{ width: '100%', alignItems: 'center' }}>
            <StyledText size={TEXT_SIZE_13} style={{ marginTop: MARGIN_TOP_LG }}>
              Сумма претензии
            </StyledText>
          </View>

          <View style={{ marginTop: MARGIN_TOP_MD }} />
          <TotalAmount
            //@ts-ignore
            value={sum}
            // style={{ backgroundColor: 'transparent' }}
            hintVisible
            hintTitle={hintTitle}
            hintDescription={hintDescription}
          />

          <Info>
            {statuses.map(status => (
              <InfoRow>
                <View style={{ width: '60%' }}>
                  <StyledText
                    size={TEXT_SIZE_14}
                    color={Colors.grayDark}
                    style={{
                      height: status.title.length * (RFValue(5) / 3.2),
                      // borderColor: 'red', borderWidth: 1
                    }}
                  >
                    {status.title}
                  </StyledText>
                </View>
                
                <StyledText size={TEXT_SIZE_14}>
                  {statusTime(status.created).length > 26 ? `${statusTime(status.created).substring(0, 20)}...` : statusTime(status.created)}
                </StyledText>
              </InfoRow>
            ))}
            
            <TouchableOpacity onPress={() => Linking.openURL('https://ej.sudrf.ru/')}>
              <StyledText size={TEXT_SIZE_15} color={Colors.blue}>
                Проверить статус заявки через суд РФ
              </StyledText>
            </TouchableOpacity>
            

            {/* <InfoRow>
              <View style={{ flexDirection: 'row' }}>
                <StyledText size={TEXT_SIZE_14} color={Colors.grayDark}>Создана заявка</StyledText>
                <Image
                  source={require('assets/images/icons/russian-emblem.png')}
                  style={{ width: 24, height: 24, position: 'absolute', left: TEXT_SIZE_14 * 53, bottom: 8 }}
                />
              </View>
              <StyledText size={TEXT_SIZE_14}>29.09.2019</StyledText>
            </InfoRow>

            <InfoRow>
              <StyledText size={TEXT_SIZE_14} color={Colors.black}>Создана заявка</StyledText>
              <StyledText size={TEXT_SIZE_14}>13.11.2019</StyledText>
            </InfoRow> */}

            {/* <StyledText color={Colors.gray} style={{ alignSelf: 'flex-end', marginTop: '1%' }}>
              {moment().subtract(4, 'days').fromNow()}
            </StyledText> */}
          </Info>

          <View style={{ marginTop: MARGIN_TOP_LG }} />
          <Documents style={[{height: 50},{height: this.state.animationHeight}]}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => this.toggleDocuments()}
            >
              <StyledText size={TEXT_SIZE_15} color={Colors.blue}>Документы</StyledText>
              <GrayPoint>
                <StyledText color={'white'}>{documents.length}</StyledText>
              </GrayPoint>

              <Image
                source={require('assets/images/icons/arrow-bottom.png')}
                style={{
                  width: 12,
                  height: 7,
                  marginRight: 15,
                  position: 'absolute',
                  right: 0,
                  transform: [{ rotate: documentsShown ? '180deg' : '0deg' }]
                }}
              />
            </TouchableOpacity>

            
            {documents.length && documentsShown ? (
              <View
                style={{ paddingVertical: 10 }}
                onLayout={({ nativeEvent }) => {
                  // if (documentsHeight <= 50) {
                  //   this.setState({ documentsHeight: nativeEvent.layout.height })
                  // }
                }}
              >
                {documents.map(doc => this._renderDocument(doc))}
              </View>
            ) : null}

            {documentsShown ? (
              <View style={{ paddingBottom: 10, marginTop: documents.length ? 0 : 50 }}>
                <MainButton
                  title={`+ Добавить документ`}
                  onPress={() => this.addDocument()}
                  dashed
                />
              </View>
              
            ) : null}
            

          </Documents>

          
          <StyledText bold size={TEXT_SIZE_16} style={{ marginTop: MARGIN_TOP_LG }}>
            Что дальше?
          </StyledText>
          <StyledText size={TEXT_SIZE_14} style={{ marginTop: MARGIN_TOP_SM }}>
            {/* Вы можете получить все оригиналы документов через крьера. */}
            {/* {documents.length
              ? 'Вы можете получить все оригиналы документов через крьера.'
              : 'Для продолжения рассмотрения иска мы должны передать в суд оригиналы документов'} */}
              Для продолжения рассмотрения иска мы должны передать в суд оригиналы документов
          </StyledText>

          <View style={{ marginTop: '5%' }} />
          <MainButton
            title={`Вызвать курьера`}
            style={application.statuses.filter(v => v.title === 'Заявка подтверждена').length === 0
              ?{ backgroundColor: Colors.gray }
              : null}
            disabled={application.statuses.filter(v => v.title === 'Заявка подтверждена').length === 0}
            onPress={() => {
              const { application }: { application: IApplication } = route.params;
              // Заявка подтверждена

              this.props.dispatch(setPenalty({
                id: application.id,
                fullName: application.fio
              }))
              this.props.navigation.navigate('CallACourier', { documents, fromDetails: true })
            }}
          />

          <Separator />

          <View style={{ marginTop: '6%' }} />
          <MainButton
            title={`Удалить заявку`}
            onPress={() => this.removeAlert(application)}
            textStyle={{ color: 'red' }}
            style={{ backgroundColor: 'rgba(255, 59, 48, 0.1)' }}
            remove
          />

        </ScrollView>

        {showToast ? (
          <BottomToast>
            <StyledText color={'white'} size={TEXT_SIZE_11}>
              {`${application.number} удалена`}
            </StyledText>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CountdownCircleTimer
                isPlaying
                duration={5}
                colors={[['black', 0.33], ['black', 0.33], ['black']]}
                size={30}
                strokeWidth={3}
                trailColor={`gray`}
              >
                {({ remainingTime, animatedColor }) => (
                  <Animated.Text style={{ color: 'white' }}>
                    {remainingTime}
                  </Animated.Text>
                )}
              </CountdownCircleTimer>

              <TextButton
                textColor={'white'}
                title={`Отменить`}
                style={{ marginLeft: 10 }}
                textSize={TEXT_SIZE_11}
                onPress={() => {
                  del = false
                  this.setState({ showToast: false, allowDelete: false })}
                }
              />
            </View>
          </BottomToast>
        ) : null}
        
      </MainLayout>
    )
  }
}

export default connect(applicationsSelector)(ApplicationDetailsScreen)

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const Info = styled.View`
  margin-top: ${MARGIN_TOP_MD};
`

const InfoRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${MARGIN_TOP_MD};
`

const Documents = styled(Animated.View)`
  padding-top: 12px;
  padding-bottom: 12px;
  padding-horizontal: ${`${PADDING_SIZE}px`};
  align-self: center;
  width: ${`${SCREEN_WIDTH}px`};
  border: 1px solid #E2E2E2;
`

const GrayPoint = styled.View`
  width: 25px;
  height: 25px;
  align-items: center;
  justify-content: center;
  background-color: #E2E2E2;
  margin-left: 8px;
  border-radius: 20px;
`

const Separator = styled.View`
  border: 1px solid #E2E2E2;
  align-self: center;
  width: ${`${SCREEN_WIDTH}px`};
  margin-top: 6%;
`

const BottomToast = styled.View`
  position: absolute;
  margin: 8px;
  bottom: 0px;
  background-color: black;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  width: 95%;
  align-self: center;
  border-radius: 4px;
  flex-direction: row;
  padding-horizontal: 15px;
`