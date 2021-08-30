import {
    FETCH_APPLICATIONS_REQUEST,
    FETCH_APPLICATIONS_SUCCESS,
  } from '../actionTypes/personalArea';
  import * as Navigation from 'navigation';
  import Api from 'api';
  import { errorHandler } from 'utils';

  export const getApplications = () => {
    return (dispatch: any) => {
      dispatch({ type: FETCH_APPLICATIONS_REQUEST })

      Api.PersonalArea.getApplications()
        .then(res => {
          const data: IApplication[] = res.data.data
          dispatch({ type: FETCH_APPLICATIONS_SUCCESS, payload: data.reverse() })
        })
        .catch(err => {
          // errorHandler(err)
        })

      // const mockedData = [
      //   {
      //     number: "Заявка №1",
      //     ddu: "Претензия по договору ДДУ №98676456346444",
      //     status: {
      //       id: 1,
      //       title: "Подан иск в суд",
      //       description: "Пользователь должен вызвать и передать оригиналы документов"
      //     }
      //   },
      //   {
      //     number: "Заявка №2",
      //     ddu: "Претензия по договору ДДУ №45544346434344634",
      //     status: {
      //       id: 2,
      //       title: "Суд запросил документы",
      //       description: "Пользователь должен вызвать и передать оригиналы документов"
      //     }
      //   },
      //   {
      //     number: "Заявка №3",
      //     ddu: "Претензия по договору ДДУ №664467346362444",
      //     status: {
      //       id: 3,
      //       title: "Деньги отправлены вам",
      //       description: "Пользователь должен вызвать и передать оригиналы документов"
      //     }
      //   },
      //   {
      //     number: "Заявка №555555",
      //     ddu: "emptyy",
      //     status: {
      //       id: 4,
      //       title: "Создана час назад",
      //       description: "emptyy"
      //     }
      //   }
      // ]

      // dispatch({ type: FETCH_APPLICATIONS_SUCCESS, payload: mockedData })
    };
  }