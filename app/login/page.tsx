'use client'

import {HomeIcon} from "@heroicons/react/24/outline";
import {useLoginMutation} from "@/api/user";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function Page() {

    const router = useRouter();

    const {mutate: loginMutate} = useLoginMutation()

    const LoginSchema = z.object({
        email: z.string().email("O campo deve ser um email válido"),
        password: z.string().min(1, "O campo não pode ser vazio")
    })

    type LoginData = z.infer<typeof LoginSchema>

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm<LoginData>({
        resolver: zodResolver(LoginSchema)
    });

    const login = (data: LoginData) => {
        loginMutate(data)
    }

    return (
        <main className={"h-screen flex flex-col"}>
            <header
                className={"flex justify-between items-center shadow-md h-24 flex-shrink-0 " +
                    "lg:justify-around"}>
                <div className={"flex justify-center w-2/5"}>
                    <HomeIcon
                        className={"w-8 text-gray-700 cursor-pointer"}
                        onClick={() => router.push("/")}/>
                </div>
                <div className={"flex justify-center w-2/5"}>
                    <Button
                        onClick={() => router.push("/register")}>
                        Crie sua conta
                    </Button>
                </div>
            </header>
            <div className={"flex flex-1 items-center justify-center"}>
                <form
                    onSubmit={handleSubmit(login)}
                    className={"flex flex-col gap-5 w-4/5 border p-10 rounded shadow-lg " +
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