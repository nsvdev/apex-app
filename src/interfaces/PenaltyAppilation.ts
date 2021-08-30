
interface BankData {
    bik: string,
    bankAccountNumber: number,
    receiverFio: string,
}

interface CardData {
    cvc: any,
    expiry: any,
    number: any,
    receiverFio: string,
}

interface IPenaltyAppilation {
    fullName: string 
    buildingAddress: string
    ddu: string
    conclusionDate: string
    transferDate: string
    inn: string
    developerName: string
    developerAddress: string
    houseAddress: string
    roomCount: string
    area: string
    floor: string
    numberStoreys: string
    housePrice: string,
    additionalSum: object[]
}

interface IPenaltyAppilationStore {
    id?: number
    fullName?: string
    buildingAddress?: string
    ddu?: string
    conclusionDate?: string
    transferDate?: string
    inn?: string
    developerName?: string
    developerAddress?: string
    houseAddress?: string
    roomCount?: string
    area?: string
    floor?: string
    numberStoreys?: string
    housePrice?: number
    additionalSum?: object[]

    bankData?: BankData
    cardData?: CardData

    hintTitle?: string
    hintDescription?: string

    receiveAmount?: string
    isFetching?: boolean
    error?: any
}