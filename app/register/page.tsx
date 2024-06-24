'use client'

import {useRegisterMutation} from "@/api/user";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import Header from "@/components/header";
import {RegisterData, RegisterSchema} from "@/schemas/schemas";


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
        <main className={"h-screen flex flex-col"}>
            <Header buttonText={"Entre em sua conta"} buttonOnClick={handleGoLogin}/>
            <div className={"flex flex-col flex-1 gap-10 items-center justify-center"}>
                <form
                    onSubmit={handleSubmit(handleRegister)}
                    className="flex flex-col gap-5 w-4/5 border p-10 rounded shadow-custom-heavy
                        lg:w-2/5
                        xl:w-1/3
                        2xl:w-1/5">
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
                    <Button type={"submit"} className={"text-md"}>Criar conta</Button>
                </form>
            </div>
        </main>
    );
}