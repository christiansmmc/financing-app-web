export interface TransactionId {
    id: number
}

export interface TagGetTranscationResponse {
    name: string
}

export interface TagId {
    id: number
}

export interface GetTransactionResponse {
    id: number,
    name: string,
    description?: string,
    value: number,
    type: TransactionType
    date: Date,
    tag: TagGetTranscationResponse
}

export interface CreateTransactionRequest {
    name: string,
    description: string | undefined,
    value: number,
    type: TransactionType,
    date?: string,
    tag?: TagId
}

export interface GetTransactionSummaryResponse {
    formattedDate: string,
    initialDate: Date,
    lastDate: Date,
    totalOutcome: number,
    totalIncome: number,
    profit: number
}

export enum TransactionType {
    INCOME = "INCOME",
    OUTCOME = "OUTCOME"
}

export interface GetTransactionMonthsResponse {
    date: string
    formattedDate: string,
}
