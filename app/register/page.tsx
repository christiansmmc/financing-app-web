'use client'

import {useRegisterMutation} from "@/api/user";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import Header from "@/components/header";
import {RegisterData, RegisterSchema} from "@/schemas/schemas";
import BookImage from "@/components/images/bookImage";


export default function Page() {

    const router = useRouter();

    const {
        mutate: registerMutate
    } = useRegisterMutation()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<RegisterData>({
        resolver: zodResolver(RegisterSchema)
    });

    const handleRegister = (data: RegisterData) => {
        registerMutate(data)
    }

    const handleGoLogin = () => {
        router.push("/login")
    }

    return (
        <main className={"h-screen flex"}>
                <div className="hidden
                lg:flex lg:justify-end lg:items-center lg:w-1/2">
                    <BookImage className="w-5/6"/>
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
                        onSubmit={handleSubmit(handleRegister)}>
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
                            <Button type={"submit"} className={"text-md w-full"}>Entrar</Button>
                            <div className="flex justify-end pt-1">Já tem uma conta?<span className="underline pl-1 cursor-pointer" onClick={handleGoLogin}>Clique aqui!</span></div>
                        </div>
                    </form>
                </div>
        </main>
    );
}