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
    TransactionId,
    UpdateTransactionRequest
} from "@/types/transactions";
import {toast} from "react-toastify";

export const getTransactions = async (yearMonth: string): Promise<GetTransactionResponse[]> => {
    const {data} = await api.get(`/transactions?year_month=${yearMonth}`)
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
            } else if (err?.response?.data?.detail != undefined) {
                toast.error(err.response.data.detail)
            } else {
                toast.error(err.message)
            }
        },
    });

    return {data, remove};
};

export const getTransactionsSummary = async (yearMonth: string): Promise<GetTransactionSummaryResponse> => {
    const {data} = await api.get(`/transactions/summary?year_month=${yearMonth}`)
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
            } else if (err?.response?.data?.detail != undefined) {
                toast.error(err.response.data.detail)
            } else {
                toast.error(err.message)
            }
        },
    });

    return {data, remove};
};

export const createTransaction = async (body: CreateTransactionRequest): Promise<void> => {
    if (body.description == "") body.description = undefined
    const promise = api.post<TransactionId>(`/transactions`, body);

    await toast.promise(promise, {
        success: "Gasto adicionado!",
        error: "Erro adicionando gasto!",
    });
}

export const useCreateTransactionMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        mutate,
        isLoading,
        isSuccess
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
            } else if (err?.response?.data?.detail != undefined) {
                toast.error(err.response.data.detail)
            } else {
                toast.error(err.message)
            }
        },
    });

    return {mutate, isLoading, isSuccess};
};

export const updateTransaction = async (body: UpdateTransactionRequest): Promise<void> => {
    if (body.description == "") body.description = undefined
    const promise = api.patch(`/transactions`, body);

    await toast.promise(promise, {
        success: "Gasto atualizado!",
        error: "Erro atualizando gasto!",
    });
}

export const useUpdateTransactionMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        mutate,
        isLoading,
        isSuccess
    } = useMutation<
        void,
        AxiosError<RequestError>,
        UpdateTransactionRequest,
        unknown
    >({
        mutationFn: (body: UpdateTransactionRequest) => updateTransaction(body),
        onSuccess: () => {
            queryClient.invalidateQueries("GetTransactions");
            queryClient.invalidateQueries("GetTransactionsSummary");
        },
        onError: (err) => {
            if (err?.response?.status === 401) {
                router.push("/login");
            } else if (err?.response?.data?.detail != undefined) {
                toast.error(err.response.data.detail)
            } else {
                toast.error(err.message)
            }
        },
    });

    return {mutate, isLoading, isSuccess};
};


export const deleteTransaction = async (id: number) => {
    await api.delete(`/transactions/${id}`)
}

export const useDeleteTransactionMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        mutate,
        isLoading
    } = useMutation<
        void,
        AxiosError<RequestError>,
        number,
        unknown
    >({
        mutationFn: (id: number) => deleteTransaction(id),
        onSuccess: () => {
            queryClient.invalidateQueries("GetTransactions")
            queryClient.invalidateQueries("GetTransactionsSummary")
        },
        onError: (err) => {
            if (err?.response?.status === 401) {
                router.push("/login");
            } else if (err?.response?.data?.detail != undefined) {
                toast.error(err.response.data.detail)
            } else {
                toast.error(err.message)
            }
        },
    });

    return {mutate, isLoading};
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
            } else if (err?.response?.data?.detail != undefined) {
                toast.error(err.response.data.detail)
            } else {
                toast.error(err.message)
            }
        },
    });

    return {data, remove};
};

