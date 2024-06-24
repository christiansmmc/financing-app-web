'use client'

import {useLoginMutation} from "@/api/user";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {LoginData, LoginSchema} from "@/schemas/schemas";
import Header from "@/components/header";

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
        <main className={"h-screen flex flex-col"}>
            <Header buttonText={"Crie sua conta"} buttonOnClick={handleGoRegister}/>
            <div className={"flex flex-1 items-center justify-center"}>
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className={"flex flex-col gap-5 w-4/5 border p-10 rounded shadow-custom-heavy " +
                        "lg:w-2/5 " +
                        "xl:w-1/3 " +
                        "2xl:w-1/5"}>
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
                    <Button type={"submit"} className={"text-md"}>Entrar</Button>
                </form>
            </div>
        </main>
    );
}