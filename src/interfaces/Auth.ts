
interface IAuthStore {
  codeSuccess: boolean,
  codeError: boolean,
  isFetching: boolean,
  phone: string,
  code: string,
  token: string
}