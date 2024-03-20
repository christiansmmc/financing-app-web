enum TransactionType {
    OUTCOME,
    INCOME
}

interface TransactionId {
    id: number
}

interface GetTransactionResponse {
    id: number,
    name: string,
    description: string,
    value: number,
    type: TransactionType
}

interface CreateTransactionRequest {
    name: string,
    description: string | undefined,
    value: number,
}