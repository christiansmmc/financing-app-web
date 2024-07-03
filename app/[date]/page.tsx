"use client";

import {ArrowLeftStartOnRectangleIcon, HomeIcon,} from "@heroicons/react/24/outline";
import {
    useCreateTransactionMutation,
    useGetTransactionsQuery,
    useGetTransactionsSummaryQuery,
} from "@/api/transactions";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {capitalize, converterValorParaReal, getDayFromDate, getTodayDay,} from "@/utils/stringUtils";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {useGetTagsQuery} from "@/api/tags";
import {useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import TransactionTagCard from "@/components/TransactionTagCard";
import TransactionCard from "@/components/transactionCard";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import Combobox from "@/components/filter/Combobox";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Loader2} from "lucide-react";
import MobileCreateTransactionDialog from "@/components/dialog/MobileCreateTransactionDialog";

export default function Page({params}: { params: { date: string } }) {
    const [tag, setTag] = useState("0");
    const [type, setType] = useState("OUTCOME")
    const [filterValue, setFilterValue] = useState("");
    const [sortBy, setSortBy] = useState("");

    const router = useRouter();

    const {data: transactionsData, remove: removeTransactionsData} =
        useGetTransactionsQuery(params.date);
    const {
        data: transactionsSummaryData,
        remove: removeTransactionsSummaryData,
    } = useGetTransactionsSummaryQuery(params.date);
    const {
        mutate: createTransactionMutate,
        isLoading: createTransactionIsLoading,
    } = useCreateTransactionMutation();
    const {
        data: tagsData
    } = useGetTagsQuery();

    const CreateTransactionFormSchema = z.object({
        name: z.string().min(1, "O campo nome é obrigatório"),
        description: z.string().optional(),
        value: z
            .string()
            .min(1, "O campo valor é obrigatório")
            .regex(
                /^\d+([,]\d{1,2})?$/,
                "O valor deve ser um número decimal com até 2 casas decimais"
            )
            .transform((valor) => parseFloat(valor.replace(",", "."))),
        dateDay: z
            .string()
            .max(2, "O campo dia só pode conter até 2 caracteres")
            .regex(
                /^(3[01]|[12][0-9]|0?[1-9])|^$/,
                "O campo só aceita numeros até o 31"
            ),
    });

    type CreateTransactionFormData = z.infer<typeof CreateTransactionFormSchema>;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<CreateTransactionFormData>({
        resolver: zodResolver(CreateTransactionFormSchema),
    });

    const createTransaction = (data: CreateTransactionFormData) => {
        const day =
            (data.dateDay?.length === 1 ? `0${data.dateDay}` : data.dateDay) ||
            getTodayDay();
        const date = `${params.date}-${day.padStart(2, "0")}`;

        // TODO ERRO CASO DIA INVALIDO, EX: 31 de FEVEREIRO

        const tag_id = tag != "0" ? parseInt(tag) : undefined;

        createTransactionMutate({
            name: data.name,
            description: data.description,
            value: data.value,
            type: type,
            transaction_date: date,
            tag_id: tag_id,
        });

        reset();
    };

    const handleLogout = () => {
        router.push("/");
        Cookies.remove("access_token");
    };

    const handleGoHome = () => {
        router.push("/dashboard");
        removeTransactionsData();
        removeTransactionsSummaryData();
    };

    const handleSetSortBy = (sortBy: string) => {
        setSortBy(sortBy);
    };

    return (
        <main className="flex flex-col h-screen">
            {/*HEADER*/}
            <header className="flex justify-between items-center shadow-md h-20 flex-shrink-0 px-10
                    lg:justify-between lg:px-60">
                <div className="w-14 flex items-center justify-center cursor-pointer
                 hover:border hover:border-gray-100 hover:p-2 hover:bg-gray-50 hover:rounded hover:shadow-custom-light"
                     onClick={handleGoHome}>
                    <HomeIcon
                        className={"flex items-center justify-center w-8 text-gray-700"}
                    />
                </div>
                <div className="w-14 flex items-center justify-center cursor-pointer
                 hover:border hover:border-gray-100 hover:p-2 hover:bg-gray-50 hover:rounded hover:shadow-custom-light"
                     onClick={handleLogout}>
                    {
                        <ArrowLeftStartOnRectangleIcon
                            className={"w-8 text-gray-700"}
                        />
                    }
                </div>
            </header>
            <div className="flex flex-col overflow-auto
            lg:flex lg:flex-row lg:overflow-auto lg:justify-center lg:px-1">
                <div className="mt-8 sm:flex sm:flex-col sm:items-center
                lg:w-1/2">
                    {/*SUMMARY*/}
                    <div className="px-2 mb-6">
                        <div className="text-center text-2xl">
                            {transactionsSummaryData
                                ? capitalize(transactionsSummaryData.formattedDate)
                                : <Skeleton className="h-7 w-[150px]"/>}
                        </div>
                        <div className="flex justify-between mt-5 border border-gray-100 rounded-lg p-3 shadow-custom-heavy
                        sm:gap-14">
                            <div className={"border-l border-l-green-400 pl-1"}>
                                <div>
                                    Entradas:
                                </div>
                                <div className="text-xl">
                                    {transactionsSummaryData
                                        ? converterValorParaReal(
                                            transactionsSummaryData.totalIncome
                                        )
                                        : <Skeleton className="h-5 w-[100px]"/>}
                                </div>
                            </div>
                            <div className="border-l border-l-red-400 pl-1">
                                <div>
                                    Saidas:
                                </div>
                                <div className="text-xl">
                                    {transactionsSummaryData
                                        ? converterValorParaReal(
                                            transactionsSummaryData.totalOutcome
                                        )
                                        : <Skeleton className="h-5 w-[100px]"/>}
                                </div>
                            </div>
                            <div className="border-l border-l-gray-500 pl-1">
                                <div>
                                    Restante:
                                </div>
                                <div className="text-xl">
                                    {transactionsSummaryData
                                        ? converterValorParaReal(transactionsSummaryData.profit)
                                        : <Skeleton className="h-5 w-[100px]"/>}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*FORM*/}
                    <div className="hidden
                            lg:block lg:px-2 lg:border lg:border-gray-100 lg:rounded-lg lg:shadow-custom-heavy lg:w-[95%]
                            xl:w-5/6
                            2xl:w-4/5
                            3xl:w-3/5">
                        <form
                            onSubmit={handleSubmit(createTransaction)}
                            className="py-8">
                            <div className="flex items-center w-full gap-3 flex-wrap justify-center">
                                <div className="w-2/5">
                                    <div>
                                        Nome<span className={"text-red-500 text-xs"}> *</span>
                                    </div>
                                    <input
                                        autoComplete={"off"}
                                        type={"text"}
                                        placeholder={"Digite aqui o nome"}
                                        className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <span className="text-xs text-red-500">
                                            {errors.name.message}
                                        </span>
                                    )}
                                </div>
                                <div className="w-2/5">
                                    <div className="text-gray-600">
                                        Valor<span className="text-red-500 text-xs"> *</span>
                                    </div>
                                    <input
                                        autoComplete={"off"}
                                        type={"text"}
                                        placeholder={"Digite aqui o valor"}
                                        className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                        {...register("value")}
                                    />
                                    {errors.value && (
                                        <span className="text-xs text-red-500">
                                          {errors.value.message}
                                        </span>
                                    )}
                                </div>
                                <div className="lg:w-2/5">
                                    <div className="text-gray-600">Categoria</div>
                                    <select
                                        className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                        id="tag"
                                        value={tag}
                                        onChange={(e) => setTag(e.target.value)}
                                        required
                                    >
                                        <option>Selecione a categoria</option>
                                        {tagsData?.map(({id, name}) => (
                                            <option key={id} value={id}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="lg:w-2/5">
                                    <div className="text-gray-600">Dia do gasto</div>
                                    <input
                                        autoComplete={"off"}
                                        type={"text"}
                                        placeholder={getTodayDay()}
                                        className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                        {...register("dateDay")}
                                    />
                                    {errors.dateDay && (
                                        <span className="text-xs text-red-500">
                                          {errors.dateDay.message}
                                        </span>
                                    )}
                                </div>
                                <div className="lg:w-2/5">
                                    <div className="text-gray-600">Tipo<span
                                        className="text-red-500 text-xs"> *</span>
                                    </div>
                                    <select
                                        className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                        id="type"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        defaultValue="OUTCOME"
                                        required
                                    >
                                        <option>Selecione o tipo</option>
                                        <option value="INCOME">
                                            Entrada
                                        </option>
                                        <option value="OUTCOME">
                                            Saida
                                        </option>
                                    </select>
                                </div>
                                <div className="w-2/5">
                                    <div className="text-gray-600">Descrição</div>
                                    <input
                                        autoComplete={"off"}
                                        placeholder={"Digite aqui a descrição"}
                                        className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                        {...register("description")}
                                    />
                                </div>
                                {createTransactionIsLoading ? (
                                    <button
                                        className="flex items-center justify-center mt-5 h-10 cursor-pointer px-5 rounded-md text-white bg-gray-700
                                      lg:w-1/3"
                                        type={"submit"} disabled={true}>
                                        <Loader2 className="animate-spin"/>
                                    </button>
                                ) : (
                                    <button className="flex items-center justify-center mt-5 h-10 cursor-pointer px-5 rounded-md
                              transition-all duration-200 ease-in-out active:scale-95 bg-slate-900 text-white
                              lg:w-1/3
                              hover:bg-gray-700" type={"submit"}>
                                        Adicionar gasto
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className="flex justify-center items-center w-full
                    lg:hidden">
                        <MobileCreateTransactionDialog tags={tagsData}
                                                       onSubmit={createTransaction}
                                                       isLoading={createTransactionIsLoading}
                                                       tag={tag}
                                                       setTag={setTag}
                                                       type={type}
                                                       setType={setType}/>
                    </div>
                </div>
                <div className="flex flex-col overflow-auto mt-8
                lg:w-1/2">
                    {/*FILTER*/}
                    <div className={"flex px-3 mb-2 gap-1"}>
                        <ToggleGroup
                            variant="outline"
                            type="single"
                            defaultValue={"day"}
                            onValueChange={(value) => handleSetSortBy(value)}
                        >
                            <ToggleGroupItem value="day" aria-label="Toggle bold">
                                <div>Dia</div>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="tag" aria-label="Toggle italic">
                                <div>Categoria</div>
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <div>
                            <Combobox
                                tagList={tagsData || []}
                                value={filterValue}
                                onChange={setFilterValue}
                            />
                            {filterValue !== "" && (
                                <Button
                                    variant={"outline"}
                                    className={"ml-0.5"}
                                    onClick={() => setFilterValue("")}
                                >
                                    X
                                </Button>
                            )}
                        </div>
                    </div>
                    {/*SCROLL*/}
                    <ScrollArea
                        type={"always"}
                        className="px-2 mb-8 pr-3
                        2xl:w-5/6 2xl:max-w-4xl">
                        {transactionsData?.length === 0 && (
                            <div
                                className={
                                    "flex items-center text-lg border-l-2 border-l-gray-500 px-6 h-12"
                                }
                            >
                                Crie novos gastos para aparecerem aqui
                            </div>
                        )}
                        {
                            sortBy === "tag"
                                ?
                                <TransactionTagCard transactionsData={transactionsData}/>
                                :
                                transactionsData
                                    ? transactionsData
                                        ?.filter((transaction) => {
                                            if (filterValue === "") {
                                                return true;
                                            }
                                            return transaction.tag.name === filterValue;
                                        })
                                        .sort((a, b) => {
                                            if (sortBy === "tag") {
                                                if (a.tag.name < b.tag.name) return -1;
                                                if (a.tag.name > b.tag.name) return 1;
                                                return 0;
                                            } else {
                                                return (
                                                    new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
                                                );
                                            }
                                        })
                                        .map((transaction, index) => {
                                            return (
                                                <TransactionCard
                                                    key={index}
                                                    id={transaction?.id}
                                                    name={transaction?.name}
                                                    description={transaction?.description}
                                                    value={transaction?.value}
                                                    transactionType={transaction?.type}
                                                    index={index}
                                                    day={getDayFromDate(transaction.transaction_date)}
                                                    tag={transaction?.tag?.name}
                                                />
                                            );
                                        })
                                    :
                                    <div>
                                        <Skeleton className="h-16 w-full mb-2"/>
                                        <Skeleton className="h-16 w-full mb-2"/>
                                        <Skeleton className="h-16 w-full mb-2"/>
                                    </div>
                        }
                    </ScrollArea>
                </div>
            </div>
        </main>
    )
}
