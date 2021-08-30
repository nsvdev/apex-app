import * as actionTypes from '../actionTypes/services';

interface Action {
  type: string
  payload: object
}

const initialState:
  {
    activeData: IService[],
    inActiveData: IService[],
    isFetching: boolean
  } = {
    activeData: [],
    inActiveData: [],
    isFetching: false,
  };

export default function (state = initialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.FETCH_SERVICES_REQUEST:
      return { ...state, ...payload, isFetching: true };
    case actionTypes.FETCH_SERVICES_SUCCESS:
      return { ...state, ...payload, isFetching: false };
    default:
      return state;
  }
}