'use client'

import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function Home() {

    const router = useRouter();

    return (
        <main className={"h-screen flex flex-col"}>
            <header className={"flex justify-around items-center shadow-md h-24 flex-shrink-0"}>
                <div className={"flex justify-center w-2/5"}>
                    <div className={"text-2xl font-semibold text-gray-700"}>Planilha de gastos</div>
                </div>
                <div className={"flex justify-center items-center gap-5 w-2/5"}>
                    <div
                        className={"cursor-pointer p-3"}
                        onClick={() => router.push("/login")}>
                        Entrar
                    </div>
                    <Button
                        onClick={() => router.push("/register")}>
                        Crie sua conta
                    </Button>
                </div>
            </header>
            <div className={"flex justify-center my-10"}>
            </div>
        </main>
    );
}
