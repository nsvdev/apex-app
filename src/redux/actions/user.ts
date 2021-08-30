import * as authActionTypes from '../actionTypes/auth';
import * as userActionTypes from '../actionTypes/user';
import * as Navigation from 'navigation';
import Api from 'api';

// export const signIn = ({ phone, code }: { phone: string, code: string }) => {
//   return (dispatch: any) => {
//     dispatch({ type: authActionTypes.SIGN_IN_REQUEST })

//     // Api.User.signIn(email, password)
//     //   .then(res => {})
//     //   .catch(err => {
//     //     errorHandler(err)
//     //     dispatch({ type: SIGN_IN_ERROR })
//     //   })

//     setTimeout(() => {
//       dispatch({ type: authActionTypes.SIGN_IN_SUCCESS, payload: { name: 'sarmat', access_token: 'F7DKJ7*fkUFJD)8&DJ' } });
//       Navigation.navigate('Onboarding')
//     }, 500)
//   };
// }

export const setUser = (data: IUser) => {
  return (dispatch: any) => {
    dispatch({ type: userActionTypes.SET_USER, payload: data })
  };
}