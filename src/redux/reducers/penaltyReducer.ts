import * as actionTypes from '../actionTypes/services';

interface Action {
  type: string
  payload: object
}

const initialState: IPenaltyAppilationStore = {
  id: null,
  fullName: null,
  buildingAddress: null,
  ddu: null,
  conclusionDate: null,
  transferDate: null,
  inn: null,
  developerName: null,
  developerAddress: null,
  houseAddress: null,
  roomCount: null,
  area: null,
  floor: null,
  numberStoreys: null,
  housePrice: null,
  additionalSum: [],

  bankData: {
    bik: null,
    bankAccountNumber: null,
    receiverFio: null
  },
  cardData: {
    bik: null,
    bankAccountNumber: null,
    receiverFio: null
  },

  receiveAmount: null,

  hintTitle: null,
  hintDescription: null,

  isFetching: false,
  error: null
};

export default function (state = initialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.SET_PENALTY_DATA:
      return { ...state, ...payload };
    case actionTypes.CREATE_PENALTY_REQUEST:
      return { ...state, ...payload, isFetching: true };
    case actionTypes.CREATE_PENALTY_SUCCESS:
      return { ...state, ...payload, isFetching: false };
    case actionTypes.CREATE_PENALTY_ERROR:
      return { ...state, error: payload, isFetching: false };

    case actionTypes.CLEAR_PENALTY:
      return { ...initialState };
      
    default:
      return state;
  }
}