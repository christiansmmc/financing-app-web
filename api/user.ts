import {LoginRequest, LoginResponse, RegisterRequest} from "@/types/user";
import api from "@/api/axiosConfig";
import {useRouter} from "next/navigation";
import {useMutation} from "react-query";
import {AxiosError} from "axios";
import {RequestError} from "@/types/request";
import {setToken} from "@/utils/authUtils";
import {toast} from "react-toastify";

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
    const {data} = await api.post(`/authenticate`, body)
    return data
}

export const useLoginMutation = () => {
    const router = useRouter();

    const {
        mutate
    } = useMutation<
        LoginResponse,
        AxiosError<RequestError>,
        LoginRequest,
        unknown
    >({
        mutationFn: (data: LoginRequest) => login(data),
        onSuccess: (data: LoginResponse) => {
            setToken(data.token)
            router.push("/dashboard")
        },
        onError: (err) => {
            if (err?.response?.data?.message != undefined) {
                toast.error(err.response.data.message)
            } else {
                toast.error(err.message)
            }
        },
    });

    return {mutate};
};

export const register = async (body: RegisterRequest) => {
    const {data} = await api.post(`/users`, body)
    return data
}

export const useRegisterMutation = () => {
    const router = useRouter();

    const {
        mutate
    } = useMutation<
        void,
        AxiosError<RequestError>,
        RegisterRequest,
        unknown
    >({
        mutationFn: (data: RegisterRequest) => register(data),
        onSuccess: () => {
            router.push("/login")
        },
        onError: (err) => {
            if (err?.response?.data?.message != undefined) {
                toast.error(err.response.data.message)
            } else {
                toast.error(err.message)
            }
        },
    });

    return {mutate};
};
