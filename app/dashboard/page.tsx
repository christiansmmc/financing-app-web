'use client'

import {useGetTransactionMonthsQuery} from "@/api/transactions";
import {capitalize, getStrYearMonthToday} from "@/utils/stringUtils";
import {useRouter} from "next/navigation";
import CreateMonthDialog from "@/components/dialog/CreateMonthDialog";
import Cookies from "js-cookie";
import {ArrowLeftStartOnRectangleIcon} from "@heroicons/react/24/outline";

export default function Page() {

    const router = useRouter();

    const {
        data: transactionMonthsData,
        remove: removeTransactionMonthsData
    } = useGetTransactionMonthsQuery();

    const strYearMonthToday = getStrYearMonthToday()

    const handleLogout = () => {
        router.push("/");
        Cookies.remove("access_token");
        removeTransactionMonthsData();
    };

    return (
        <main className={"h-screen flex flex-col"}>
            <header
                className={"flex justify-between items-center shadow-md h-24 flex-shrink-0 px-10 " +
                    "lg:justify-between lg:px-60"}>
                <div className={""}>
                    <div className={"text-2xl font-semibold text-gray-700"}>Planilha de gastos</div>
                </div>
                <div className={""}>
                    {<ArrowLeftStartOnRectangleIcon
                        onClick={handleLogout}
                        className={"w-8 text-gray-700 cursor-pointer"}/>}
                </div>
            </header>
            <div className={"w-full"}>
                <div className={"flex justify-center my-10"}>
                    <CreateMonthDialog/>
                </div>
                <div className={"flex flex-col gap-3 items-center my-10"}>
                    {transactionMonthsData?.length === 0 &&
                        <div
                            className={"flex items-center text-lg border-l-2 border-l-gray-500 px-6 h-12"}
                        >
                            Crie um novo mês e adicione pelo menos 1 gasto para aparecerem aqui
                        </div>}
                    {
                        transactionMonthsData
                            ?.sort((a, b) => b.date.localeCompare(a.date))
                            .map((transactionMonth, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`border-l-2 p-8 shadow-md w-4/5 cursor-pointer 
                                        lg:w-1/2
                                        xl:w-1/3
                                        2xl:w-1/4
                                        ${transactionMonth.date === strYearMonthToday ? 'border-green-500' : 'border-gray-500'}`}
                                        onClick={() => router.push(`/${transactionMonth.date}`)}>
                                        {capitalize(transactionMonth.formattedDate)}
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
        </main>
    );
}