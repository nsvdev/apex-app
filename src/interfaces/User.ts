interface IUser {
  name?: string
  middleName?: string
  lastName?: string
  phone?: string
}

interface IUserStore extends IUser {
  isFetching?: boolean
}