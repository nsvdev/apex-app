import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { URL } from '../constants';
import { errorHandler } from 'utils';
import { getApplications } from 'redux/actions';
import { store } from 'redux/store'
import moment from 'moment';

axios.defaults.baseURL = URL;
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
// axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';

axios.interceptors.request.use(async function (config) {
  const state = store.getState();
  // console.log(state.auth?.token)

  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${state.auth?.token}`
    }
  };
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


const User = {
  signIn: (email, password) => {
    var formData = new FormData();
    formData.append('email', email); 
    formData.append('password', password);

    return axios.post('/user/login', formData)
  },

  signUp: ({ name, surname, email, password }) => {
    var formData = new FormData();
    formData.append('first_name', name); 
    formData.append('last_name', surname); 
    formData.append('email', email); 
    formData.append('password', password); 
    
    return axios.post('/user', formData)
  },

  resetPassword: (email) => {
    var formData = new FormData();
    formData.append('email', email); 
    
    return axios.post('/user/reset', formData)
  },
  getUserData: () => {
    return axios.get('/user')
  }
}

const Auth = {
  sendSms: (phone) => {
    var formData = new FormData();
    formData.append('phone', phone); 

    return axios.post('/sms/send', formData)
  },
  signIn: (phone, code) => {
    var formData = new FormData();
    formData.append('phone', phone);
    formData.append('code', code);

    // remove!
    formData.append('name', 'name');
    formData.append('middle_name', 'middle_name');
    formData.append('last_name', 'last_name'); 

    return axios.post('/user', formData)
  },
  getEsiaUrl: () => {
    return axios.get('/auth/esia/url')
  },
  esia: (code) => {
    var formData = new FormData();
    formData.append('code', code);
    return axios.post('/auth/esia', formData)
  }
}

const Onboarding = {
  getData: async () => axios.get(`/onboarding`),
}

const Services = {
  getData: async () => axios.get(`/services`),
  calcultePenalty: async ({
    cost,
    dateStart,
    dateEnd }
    : {
    cost: number,
    dateStart: string,
    dateEnd: string }
    )=> {
      return new Promise((resolve, reject) => {
        axios.get(`/calculate?cost=${cost}&date_start=${dateStart}&date_end=${dateEnd}`)
          .then(res => resolve(res.data))
          .catch(err => {
            console.log(err.response)
            // errorHandler(err)
            reject(err)
          })
      })
  },
  createPenalty: async (postData: IPenaltyAppilationStore) => {

    return new Promise((resolve, reject) => {
      const state = store.getState();

      const newAdditionals = []
      postData.additionalSum.map(item => {
        newAdditionals.push({
          sum: String(item.sum),
          code: String(item.type)
        })
      })

      // console.log(state.auth?.token)

      var formData = new FormData();
      formData.append('full_name',  String(postData.fullName));
      formData.append('building_address',  String(postData.buildingAddress));
      formData.append('conclusion_date',  String(postData.conclusionDate));
      formData.append('transfer_date',  String(postData.transferDate));
      formData.append('inn',  String(postData.inn));
      formData.append('developer_name',  String(postData.developerName));
      formData.append('developer_address',  String(postData.developerAddress));
      formData.append('house_address',  String(postData.houseAddress));
      formData.append('room_count',  String(postData.roomCount));
      formData.append('area',  String(postData.area));
      formData.append('floor', String(postData.floor));
      formData.append('number_storeys', '0');
      formData.append('house_price', String(postData.housePrice));
      // formData.append('additional_sum', JSON.stringify(newAdditionals))
      formData.append('sum', postData.sum ? String(postData.sum) : '0')

      if (postData.additionalSum.length > 0 && postData.additionalSum[0]["code"] && postData.additionalSum[0]["sum"]) {
        postData.additionalSum.map((itm, i) => {
          formData.append(`additional_sum[${i}][code]`, itm.type ? String(itm.type) : null);
          formData.append(`additional_sum[${i}][sum]`, itm.sum ? String(itm.sum.replace(/\s/g, '')) : null);
        })
      }

      console.log(formData)

      // if (postData.bankData.bik && postData.bankData.bankAccountNumber && postData.bankData.receiverFio) {
      //   formData.append('bic', String(postData.bankData.bik));
      //   formData.append('account_number', String(postData.bankData.bankAccountNumber));
      //   formData.append('name_recipient', String(postData.bankData.receiverFio));
      // }

      if (postData.ddu) {
        formData.append('ddu', String(postData.ddu));
      }

      // console.log(formData)

      axios.post(`/application`, formData)
        .then(res => resolve(res.data))
        .catch(err => {
          console.log(err.response)
          reject(err)
        })

    })
  },
  updatePenalty: async (id, postData: IPenaltyAppilationStore, requisites=false) => {
    return new Promise((resolve, reject) => {

      if (requisites) {
        if (postData?.bankData?.bik) {
          // bank
          axios.put(`/application/${id}`, {
            account_number: postData.bankData.bankAccountNumber,
            bic: postData.bankData.bik,
            name_recipient: postData.bankData.receiverFio
          })
            .then(res => resolve(res.data))
            .catch(err => {
              reject(err)
            })
        } else {
          // card
          axios.put(`/application/${id}`, {
            owner_name: postData.cardData.receiverFio,
            card_number: postData.cardData.number,
            // cvv
            code: postData.cardData.cvc,
            // срок
            validity: postData.cardData.expiry
          })
            .then(res => resolve(res.data))
            .catch(err => {
              reject(err)
            })
        }
        
      } else {
        axios.put(`/application/${id}`, {
          full_name: postData.fullName,
          building_address: postData.buildingAddress,
          conclusion_date: postData.conclusionDate,
          transfer_date: postData.transferDate,
          inn: postData.inn,
          developer_name: postData.developerName,
          developer_address: postData.developerAddress,
          house_address: postData.houseAddress,
          room_count: postData.roomCount,
          area: postData.area,
          floor: postData.floor,
          number_storeys: postData.numberStoreys,
          house_price: Number(postData.housePrice),
          additional_sum: postData.additionalSum,
          ddu: postData.ddu,
          sum: postData.sum ? Number(postData.sum) : 0,
        })
          .then(res => resolve(res.data))
          .catch(err => {
            reject(err)
          })
      }
    })
  },
  callACourier: async ({
    fio,
    address,
    phone,
    arrivalDate,
    timeFrom,
    timeTo
  }) => {
    return new Promise((resolve, reject) => {
      const state = store.getState()

      var formData = new FormData();
      formData.append('full_name',  String(fio));
      formData.append('address',  String(address));
      formData.append('contact_phone',  String(phone));
      formData.append('date',  moment(arrivalDate).toISOString());
      formData.append('time',  `${timeFrom}-${timeTo}`);

      axios.post(`/application/courier/${state.penalty.id}`, formData)
        .then(res => resolve(res.data))
        .catch(err => {
          reject(err)
        })
    })
  },
  sendDocuments: async (documents, signatire?, noType=false, count=1) => {
    return new Promise((resolve, reject) => {
      const state = store.getState()
      var formData = new FormData();

      let hasImages = false
      documents.map(doc => {
        if (doc.images.length > 0) {
          hasImages = true
        }
      })
      
      if (!hasImages) {
        resolve(null)
        return
      }

      if (noType) {
        documents[0].images.map((img, i) => {
          // TODO: android uri 'file://' + this.recorder.fsPath
          formData.append(`contract[no_type][${i}]`, {uri: img.uri, name: `Document_№${count}.jpg`, type: 'image/jpeg'})
        })
      } else {
        documents.map((document, i) => {
          if (document.images.length > 0) {
            switch (i) {
              case 0:
                document.images.map((img, i) => {
                  // TODO: android uri 'file://' + this.recorder.fsPath
                  formData.append(`contract[contract][${i}]`, {uri: img.uri, name: `Scan_dogovora_№${i+1}.jpg`, type: 'image/jpeg'})
                })
                break;
              case 1:
                document.images.map((img, i) => {
                  formData.append(`contract[receipt][${i}]`, {uri: img.uri, name: `Scan_kvitancii_№${i+1}.jpg`, type: 'image/jpeg'})
                })
                break;
              case 2:
                document.images.map((img, i) => {
                  formData.append(`contract[postal_receipt][${i}]`, {uri: img.uri, name: `Scan_pochtovoy_kvitancii_№${i+1}.jpg`, type: 'image/jpeg'})
                })
                break;
              case 3:
                document.images.map((img, i) => {
                  formData.append(`contract[duty][${i}]`, {uri: img.uri, name: `Scan_kvitancii_ob_uplate_poshlini_№${i+1}.jpg`, type: 'image/jpeg'})
                })
                break;
              case 4:
                document.images.map((img, i) => {
                  formData.append(`contract[passport][${i}]`, {uri: img.uri, name: `Scan_pasport_№${i+1}.jpg`, type: 'image/jpg'})
                })
                break;
              default:
                break;
            }
          }
        })
      }

      console.log(formData)


      if (signatire) {
        formData.append('signatire', String(signatire));
      }
      console.log(`penalty id - ${state.penalty.id}`)
      // applications
      axios.post(
        `/applicationsDocs/${state.penalty.id}`,
        formData
      )
        .then(res => resolve(res.data))
        .catch(err => {
          console.log(err?.response)
          reject(err)
        })
    })
  },
  deleteDocument: async (id, ids) => {
    const formData = new FormData();
    formData.append(`ids[0]`, String(ids[0]))
    // applications
    return axios.delete(`/applicationsDocs/${id}`, {
      params: { ids: ids }
    })
  },
  deleteApplication: async (id) => axios.delete(`/application/${id}`),

  getBuilderByInn: async (inn) => axios.get(`/developer/inn?inn=${inn}`)
}

const PersonalArea = {
  getApplications: async () => {
    // console.log(axios.defaults.headers.common['Authorization'])
    return axios.get(`/application`)
  },
  getApplicationById: async (id) => {
    // alert(axios.defaults.headers.common['Authorization'])
    return axios.get(`/application/${id}`)
  },
  getApplicationForEdit: async (id) => {
    // console.log(axios.defaults.headers.common['Authorization'])
    return axios.get(`/application/${id}/edit`)
  }
}

export default {
  User,
  Auth,
  Onboarding,
  Services,
  PersonalArea
}