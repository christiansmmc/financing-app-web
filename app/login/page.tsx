'use client'

import {useLoginMutation} from "@/api/user";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import GraphicImage from "@/components/images/graphicImage";
import {useRouter} from "next/navigation";
import {LoginData, LoginSchema} from "@/schemas/schemas";

export default function Page() {

    const router = useRouter();

    const {
        mutate: loginMutate
    } = useLoginMutation()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginData>({
        resolver: zodResolver(LoginSchema)
    });

    const handleLogin = (data: LoginData) => {
        loginMutate(data)
    }

    const handleGoRegister = () => {
        router.push("/register")
    }

    return (
        <main className={"h-screen flex"}>
            <div className="hidden
                lg:flex lg:justify-end lg:items-center lg:w-1/2">
                <GraphicImage className="w-5/6"/>
            </div>
            <div className="flex w-full justify-center items-center
                lg:w-1/2 lg:shadow-custom-heavy lg:ml-10
                2xl:justify-start 2xl:pl-28">
                <form
                    className="flex flex-col gap-5 w-5/6 border border-gray-100 p-5 shadow-custom-heavy
                        sm:w-2/3 sm:p-10
                        md:w-1/2
                        lg:p-10 lg:w-4/5
                        2xl:w-3/5
                        3xl:w-2/5"
                    onSubmit={handleSubmit(handleLogin)}>
                    <div>
                        <div className={"text-gray-600"}>Email<span className={"text-red-500"}>*</span></div>
                        <input
                            type={"email"}
                            placeholder={"Digite aqui o email"}
                            className={"bg-gray-200 w-full h-10 rounded pl-2 text-sm"}
                            {...register("email")}/>
                        {errors.email &&
                            <span className={"text-xs text-red-500"}>{errors.email.message}</span>}
                    </div>
                    <div>
                        <div className={"text-gray-600"}>Senha<span className={"text-red-500"}>*</span></div>
                        <input
                            type={"password"}
                            placeholder={"Digite aqui a senha"}
                            className={"bg-gray-200 w-full h-10 rounded pl-2 text-sm"}
                            {...register("password")}/>
                        {errors.password &&
                            <span className={"text-xs text-red-500"}>{errors.password.message}</span>}
                    </div>
                    <div className="flex flex-col relative">
                        <button className="flex items-center justify-center w-full h-10 cursor-pointer px-5 rounded-md
                            transition-all duration-200 ease-in-out active:scale-95 bg-slate-900 text-white
                            hover:bg-gray-700" type={"submit"}>
                            Entrar
                        </button>
                        <div className="flex justify-end pt-1">Ainda não tem conta?<span
                            className="underline pl-1 cursor-pointer" onClick={handleGoRegister}>Clique aqui!</span>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}