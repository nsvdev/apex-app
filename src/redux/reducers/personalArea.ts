import * as actionTypes from '../actionTypes/personalArea';
import * as authActionTypes from '../actionTypes/auth';

interface Action {
  type: string
  payload: object
}

const initialState:
  {
    applications: IApplication[],
    isCasesFetching: boolean
  } = {
    applications: [],
    isCasesFetching: false
  };

export default function (state = initialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.FETCH_APPLICATIONS_REQUEST:
      return { ...state, ...payload, isCasesFetching: true };
    case actionTypes.FETCH_APPLICATIONS_SUCCESS:
      return { ...state, applications: payload, isCasesFetching: false };
    case authActionTypes.LOGOUT:
      return { ...state, applications: [] };
    default:
      return state;
  }
}