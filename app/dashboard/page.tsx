'use client'

import {useGetTransactionMonthsQuery} from "@/api/transactions";
import {capitalize, getStrYearMonthToday} from "@/utils/stringUtils";
import {useRouter} from "next/navigation";
import CreateMonthDialog from "@/components/dialog/CreateMonthDialog";
import Cookies from "js-cookie";
import {ArrowLeftStartOnRectangleIcon} from "@heroicons/react/24/outline";
import {Skeleton} from "@/components/ui/skeleton";

export default function Page() {

    const router = useRouter();

    const {
        data: transactionMonthsData,
        remove: removeTransactionMonthsData
    } = useGetTransactionMonthsQuery();

    const handleLogout = () => {
        router.push("/");
        Cookies.remove("access_token");
        removeTransactionMonthsData();
    };

    return (
        <main className={"h-screen flex flex-col"}>
            <header
                className={"flex justify-between items-center shadow-md h-20 flex-shrink-0 px-10 " +
                    "lg:justify-between lg:px-60"}>
                <div className={""}>
                    <div className={"text-2xl font-semibold text-gray-700"}>Planilha de gastos</div>
                </div>
                <div className="w-14 flex items-center justify-center cursor-pointer
                 hover:border hover:border-gray-100 hover:p-2 hover:bg-gray-50 hover:rounded hover:shadow-custom-light"
                     onClick={handleLogout}>
                    {<ArrowLeftStartOnRectangleIcon className={"w-8 text-gray-700"}/>}
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
                            ? transactionMonthsData
                                ?.sort((a, b) => b.date.localeCompare(a.date))
                                .map((transactionMonth, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`border-l-2 p-8 w-4/5 cursor-pointer rounded shadow transition-all duration-200 ease-in-out active:scale-95
                                        hover:bg-gray-50 
                                        lg:w-1/2
                                        xl:w-1/3
                                        2xl:max-w-2xl
                                       ${transactionMonth.date === getStrYearMonthToday() ? 'border-l-green-500' : 'border-l-blue-500'}`}
                                            onClick={() => router.push(`/${transactionMonth.date}`)}>
                                            {capitalize(transactionMonth.formattedDate)}
                                        </div>
                                    )
                                })
                            : <Skeleton className="h-24 lg:w-1/2 xl:w-1/3 2xl:max-w-2xl"/>
                    }
                </div>
            </div>
        </main>
    );
}