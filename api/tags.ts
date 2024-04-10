'use client'

import api from "@/api/axiosConfig";
import {useRouter} from "next/navigation";
import {useQuery} from "react-query";
import {AxiosError} from "axios";
import {RequestError} from "@/types/request";
import {GetTagsResponse} from "@/types/tags";

export const getTags = async (): Promise<GetTagsResponse[]> => {
    const {data} = await api.get(`/tags`)
    return data
}

export const useGetTagsQuery = () => {
    const router = useRouter();

    const {
        data
    } = useQuery<
        GetTagsResponse[],
        AxiosError<RequestError>
    >({
        queryKey: ["GetTags"],
        queryFn: () => getTags(),
        onError: (err) => {
            if (err?.response?.status === 401) {
                router.push("/login");
            }
        },
    });

    return {data};
};
