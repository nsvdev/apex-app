import * as actionTypes from '../actionTypes/services';
import Api from 'api';
import { errorHandler } from 'utils';
import { getApplications } from '../actions'
import { setUser } from './user';

/** добпвляет или обновляет стор  */
export const setPenalty = (payload: IPenaltyAppilationStore) => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.SET_PENALTY_DATA, payload })
  }
}

export const createPenalty = (payload: IPenaltyAppilationStore, navigation, isEditing) => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.CREATE_PENALTY_REQUEST })

    Api.Services.createPenalty(payload)
        .then((res: any) => {
          const data: any = res.data

          dispatch({ type: actionTypes.CREATE_PENALTY_SUCCESS })

          dispatch({ type: actionTypes.SET_PENALTY_DATA, payload: { id: res.data } })
          console.log('created penalty...')

          if (isEditing) {
            navigation.navigate('PenaltyEdit3')
          } else {
            navigation.navigate('PenaltyCreation3')
          }

          setTimeout(() => {
            dispatch(getApplications())
          }, 1000);
        })
        .catch(err => {
          console.log(err)
          // errorHandler(err)
          alert(JSON.stringify(err))
          dispatch({ type: actionTypes.CREATE_PENALTY_ERROR })
        })
  }
}

export const updatePenalty = (id, payload, navigation, callback) => {
  return (dispatch: any) => {
    
    Api.Services.updatePenalty(id, payload)
        .then((res: any) => {
          navigation.goBack()
          callback()
        })
        .catch(err => {
          // errorHandler(err)
        })
  }
}

export const clearPenalty = () => {
  return (dispatch: any) => {
    dispatch({ type: actionTypes.CLEAR_PENALTY })
  }
}
