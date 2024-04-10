'use client'

import api from "@/api/axiosConfig";
import {useRouter} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {RequestError} from "@/types/request";
import {
    CreateTransactionRequest,
    GetTransactionMonthsResponse,
    GetTransactionResponse,
    GetTransactionSummaryResponse,
    TransactionId
} from "@/types/transactions";
import {toast} from "react-toastify";

export const getTransactions = async (yearMonth: string): Promise<GetTransactionResponse[]> => {
    const {data} = await api.get(`/transactions?yearMonth=${yearMonth}`)
    return data
}

export const useGetTransactionsQuery = (yearMonth: string) => {
    const router = useRouter();

    const {
        data,
        remove
    } = useQuery<
        GetTransactionResponse[],
        AxiosError<RequestError>
    >({
        queryKey: ["GetTransactions"],
        queryFn: () => getTransactions(yearMonth),
        onError: (err) => {
            if (err?.response?.status === 401) {
                router.push("/login");
            }
        },
    });

    return {data, remove};
};

export const getTransactionsSummary = async (yearMonth: string): Promise<GetTransactionSummaryResponse> => {
    const {data} = await api.get(`/transactions/summary?yearMonth=${yearMonth}`)
    return data
}

export const useGetTransactionsSummaryQuery = (yearMonth: string) => {
    const router = useRouter();

    const {
        data,
        remove
    } = useQuery<
        GetTransactionSummaryResponse,
        AxiosError<RequestError>
    >({
        queryKey: ["GetTransactionsSummary"],
        queryFn: () => getTransactionsSummary(yearMonth),
        onError: (err) => {
            if (err?.response?.status === 401) {
                router.push("/login");
            }
        },
    });

    return {data, remove};
};

export const createTransaction = async (body: CreateTransactionRequest): Promise<void> => {
    if (body.description == "") body.description = undefined
    await api.post<TransactionId>(`/transactions`, body);
}

export const useCreateTransactionMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        mutate,
        isLoading
    } = useMutation<
        void,
        AxiosError<RequestError>,
        CreateTransactionRequest,
        unknown
    >({
        mutationFn: (body: CreateTransactionRequest) => createTransaction(body),
        onSuccess: () => {
            queryClient.invalidateQueries("GetTransactions");
            queryClient.invalidateQueries("GetTransactionsSummary");
        },
        onError: (err) => {
            if (err?.response?.status === 401) {
                router.push("/login");
            } else if (err?.response?.data?.message != undefined) {
                toast.error(err.message)
            }
        },
    });

    return {mutate, isLoading};
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
            queryClient.invalidateQueries("GetTransactionsSummary");
        },
        onError: (err) => {
            if (err?.response?.status === 401) {
                router.push("/login");
            } else if (err?.response?.data?.message != undefined) {
                toast.error(err.message)
            }
        },
    });

    return {mutate};
};

export const getTransactionMonths = async (): Promise<GetTransactionMonthsResponse[]> => {
    const {data} = await api.get(`/transactions/transaction-months`)
    return data
}

export const useGetTransactionMonthsQuery = () => {
    const router = useRouter();

    const {
        data,
        remove
    } = useQuery<
        GetTransactionMonthsResponse[],
        AxiosError<RequestError>
    >({
        queryKey: ["GetTransactionMonths"],
        queryFn: () => getTransactionMonths(),
        onError: (err) => {
            if (err?.response?.status === 401) {
                router.push("/login");
            } else if (err?.response?.data?.message != undefined) {
                toast.error(err.message)
            }
        },
    });

    return {data, remove};
};

