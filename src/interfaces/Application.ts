
interface IApplication {
  id: Number
  number: string,
  ddu: string,
  statuses: IStatus[]
}

interface IStatus {
  id: number,
  title: string,
  description: string
}

interface IApplicationDetails extends IApplication {
  sum: string
  docs: IDoc[]
}

interface IDoc {
  url: string,
  name: string
}