import * as actionTypes from '../actionTypes/services';
import * as Navigation from 'navigation';
import Api from 'api';
import { errorHandler } from 'utils';

export const getServices = () => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.FETCH_SERVICES_REQUEST })

    Api.Services.getData()
      .then(res => {
          const data: IService[] = res.data.data.map(item => ({
            ...item,
            // image: 
          }))
          dispatch({
            type: actionTypes.FETCH_SERVICES_SUCCESS,
            payload: {
              activeData: data.filter((service: IService) => service.is_active),
              inActiveData: data.filter((service: IService) => !service.is_active)
            }
          })
      })
      .catch(err => {
          errorHandler(err)
          // dispatch({ type: FETCH_ONBOARDING_SUCCESS })
      })
  };
}


export const createPenaltyApplication = (postData: IPenaltyAppilation) => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.CREATE_PENALTY_REQUEST })

    Api.Services.createPenalty(postData)
      .then(res => {
        // const data: IService[] = res.data.data.map(item => ({
        //   ...item,
        //   // image: 
        // }))
        // dispatch({
        //   type: actionTypes.CREATE_PENALTY_SUCCESS,
        //   payload: {
        //     activeData: data.filter((service: IService) => service.is_active),
        //     inActiveData: data.filter((service: IService) => !service.is_active)
        //   }
        // })
        // console.log(res)
      })
      .catch(err => {
          errorHandler(err)
          dispatch({ type: actionTypes.CREATE_PENALTY_SUCCESS })
      })
  }
}