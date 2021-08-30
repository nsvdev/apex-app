
interface IService {
  id: number
  name: string
  detail_name: string
  description: string
  is_active: boolean
}

interface IServicesStore {
  activeData: IService[]
  inActiveData: IService[]
  isFetching: boolean
}

