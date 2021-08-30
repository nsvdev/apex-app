import {
    FETCH_ONBOARDING_REQUEST,
    FETCH_ONBOARDING_SUCCESS,
    DISABLE_ONBOARDING
  } from '../actionTypes/onboarding';
  import * as Navigation from 'navigation';
  import Api from 'api';
  import { errorHandler } from 'utils';

  export const getOnboardingData = () => {
    return (dispatch: any) => {
      dispatch({ type: FETCH_ONBOARDING_REQUEST })
  
      const mockedData = [
        {
          id: 1,
          link: '',
          subtitle: 'Дела по защите прав потребителей, оспаривание штрафов, семейные споры  и так далее',
          title: 'Автоматизированная юридическая помощь в стандартных случаях',
          img: require('../../assets/images/1.png')
        },
        {
          id: 2,
          link: '',
          subtitle: 'Система сформирует необходимые документы и отправит их в соответсвующие инстанции',
          title: 'Введите данные по вашему делу',
          img: require('../../assets/images/2.png')
        },
        {
          id: 3,
          link: '',
          subtitle: 'Уведомления из судов и от приставов в вашем смартфоне.',
          title: 'Устройтесь поудобнее и получайте уведомления о ходе вашего дела',
          img: require('../../assets/images/3.png')
        }
      ]

      Api.Onboarding.getData()
        .then(res => {
           const data: IOnboarding[] = res.data.data
          dispatch({ type: FETCH_ONBOARDING_SUCCESS, payload: mockedData })
        })
        .catch(err => {
          errorHandler(err)
          // dispatch({ type: FETCH_ONBOARDING_SUCCESS })
        })


      // setTimeout(() => {
      //   dispatch({ type: FETCH_ONBOARDING_SUCCESS, payload: data });
      //   Navigation.navigate('Onboarding')
      // }, 500)
    };
  }

  export const disableOnboarding = () => {
    return (dispatch: any) => {
      dispatch({ type: DISABLE_ONBOARDING })
    }
  }