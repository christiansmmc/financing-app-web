'use client'

import {useRouter} from "next/navigation";

export default function Home() {

    const router = useRouter();

    return (
        <main className={"h-screen flex flex-col"}>
            <header className={"flex justify-around items-center shadow-md h-20 flex-shrink-0"}>
                <div className={"flex justify-center w-2/5"}>
                    <div className={"text-2xl font-semibold text-gray-700"}>Planilha de gastos</div>
                </div>
                <div className={"flex justify-center items-center gap-5 w-2/5"}>
                    <div
                        className="flex items-center justify-center w-20 h-10 cursor-pointer p-3 rounded-md transition-all duration-300 ease-in-out active:scale-95
                        hover:bg-blue-500 hover:text-white"
                        onClick={() => router.push("/login")}>
                        Entrar
                    </div>
                    <div className="flex items-center justify-center w-32 h-10 cursor-pointer p-3 rounded-md transition-all duration-300 ease-in-out active:scale-95 bg-slate-900 text-white
                    hover:bg-gray-700"
                         onClick={() => router.push("/register")}>
                        Crie sua conta
                    </div>
                </div>
            </header>
            <div className={"flex justify-center my-10"}>
            </div>
        </main>
    );
}
