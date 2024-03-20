'use client'

import api from "@/api/axiosConfig";
import {useRouter} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {RequestError} from "@/api/interfaces/request";

export const getTransactions = async (yearMonth: string): Promise<GetTransactionResponse[]> => {
    const {data} = await api.get(`/transactions?yearMonth=${yearMonth}`)
    return data
}

export const useGetTransactionsQuery = (yearMonth: string) => {
    const router = useRouter();

    const {
        data
    } = useQuery<
        GetTransactionResponse[],
        AxiosError<RequestError>
    >({
        queryKey: ["GetTransactions"],
        queryFn: () => getTransactions(yearMonth),
        onError: (err) => {
            if (err?.response?.status === 401) {
                router.push("/");
            }
        },
    });

    return {data};
};

export const createTransaction = async (body: CreateTransactionRequest): Promise<TransactionId> => {
    if (body.description == "") body.description = undefined

    const {data} = await api.post(`/transactions`, body)
    return data
}

export const useCreateTransactionMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        mutate
    } = useMutation<
        TransactionId,
        AxiosError<RequestError>,
        CreateTransactionRequest,
        unknown
    >({
        mutationFn: (body: CreateTransactionRequest) => createTransaction(body),
        onSuccess: () => {
            queryClient.invalidateQueries("GetTransactions");
        },
        onError: (err) => {
            if (err?.response?.status === 401) {
                router.push("/");
            }
        },
    });

    return {mutate};
};

export const deleteTransaction = async (id: number) => {
    await api.delete(`/transactions/${id}`)
}

export const useDeleteTransactionMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        mutate
    } = useMutation<
        void,
        AxiosError<RequestError>,
        number,
        unknown
    >({
        mutationFn: (id: number) => deleteTransaction(id),
        onSuccess: () => {
            queryClient.invalidateQueries("GetTransactions");
        },
        onError: (err) => {
            if (err?.response?.status === 401) {
                router.push("/");
            }
        },
    });

    return {mutate};
};