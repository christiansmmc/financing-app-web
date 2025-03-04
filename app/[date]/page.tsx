"use client";

import {HomeIcon,} from "@heroicons/react/24/outline";
import {
    useCreateTransactionMutation,
    useGetTransactionsQuery,
    useGetTransactionsSummaryQuery,
    useImportCsvMutation,
} from "@/api/transactions";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {capitalize, converterValorParaReal, getTodayDay,} from "@/utils/stringUtils";
import {useRouter} from "next/navigation";
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
import ImportCsvDialog from "@/components/dialog/ImportCsvDialog";
import {ImportCsvRequest} from "@/types/transactions";

export default function Page({params}: { params: { date: string } }) {
    const [tag, setTag] = useState("0");
    const [type, setType] = useState("OUTCOME");
    const [filterValue, setFilterValue] = useState("");
    const [sortBy, setSortBy] = useState("");

    const [isDragDropOpen, setIsDragDropOpen] = useState(false);

    const router = useRouter();

    const {
        data: transactionsData,
        remove: removeTransactionsData
    } = useGetTransactionsQuery(params.date);

    const {
        data: transactionsSummaryData,
        remove: removeTransactionsSummaryData,
    } = useGetTransactionsSummaryQuery(params.date);

    const {
        mutate: createTransactionMutate,
        isLoading: createTransactionIsLoading,
    } = useCreateTransactionMutation();

    const {
        mutate: importCsvMutate,
        isLoading: importCsvIsLoading,
    } = useImportCsvMutation();

    const {data: tagsData} = useGetTagsQuery();

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

    const handleGoHome = () => {
        router.push("/dashboard");
        removeTransactionsData();
        removeTransactionsSummaryData();
    };

    const handleSetSortBy = (sortBy: string) => {
        setSortBy(sortBy);
    };


    const handleImportCsv = (file: { name: string; base64: string }) => {
        if (transactionsSummaryData === undefined) {
            return;
        }

        const initialDate = new Date(transactionsSummaryData.initialDate);
        const year = initialDate.getFullYear();
        const month = String(initialDate.getMonth() + 1).padStart(2, '0');

        const body: ImportCsvRequest = {
            bank_name: "nubank",
            transactions_date: `${year}-${month}`,
            csv_base64: file.base64
        }

        importCsvMutate(body)
    };

    return (
        <main className="h-full flex flex-col">
            {/*HEADER WEB*/}
            <header
                className="hidden
                xl:flex xl:justify-between xl:items-center xl:gap-3 xl:h-20 xl:px-5 xl:shadow-md">
                <div
                    className="w-20 h-12 ml-10 flex items-center justify-center cursor-pointer border-b border-gray-700
                    transition-all duration-75 ease-in-out
                    active:scale-95 active:bg-gray-100
                    hover:bg-gray-100
                    xl:ml-24
                    3xl:ml-44"
                    onClick={handleGoHome}
                >
                    <HomeIcon className="flex items-center justify-center w-8 text-gray-700"/>
                </div>
            </header>
            <div className="flex flex-1 flex-col overflow-auto
            xl:flex-row
            3xl:justify-center 3xl:gap-36">
                <div className="mt-8
                xl:w-1/2
                3xl:w-[35%] 3xl:mx-0">
                    <div className="px-2 mb-6">
                        {/*DATE HEADER*/}
                        <div className="text-center text-3xl font-light">
                            {transactionsSummaryData
                                ? capitalize(transactionsSummaryData.formattedDate)
                                : <div><Skeleton className="mx-auto h-9 w-[160px]"/></div>
                            }
                        </div>
                        {/*MONEY SUMMARY*/}
                        <div
                            className="flex justify-between mt-5 rounded-lg p-3 shadow-custom-heavy border border-[#58667e1a] mx-auto
                            sm:w-4/5
                            3xl:w-3/5">
                            <div className="border-l border-l-green-400 pl-1">
                                <div>Entradas:</div>
                                <div className="text-xl">
                                    {transactionsSummaryData
                                        ? converterValorParaReal(transactionsSummaryData.totalIncome)
                                        : <Skeleton className="h-6 w-[100px]"/>
                                    }
                                </div>
                            </div>
                            <div className="border-l border-l-red-400 pl-1">
                                <div>Saidas:</div>
                                <div className="text-xl">
                                    {transactionsSummaryData
                                        ? converterValorParaReal(transactionsSummaryData.totalOutcome)
                                        : <Skeleton className="h-6 w-[100px]"/>
                                    }
                                </div>
                            </div>
                            <div className="border-l border-l-gray-500 pl-1">
                                <div>Restante:</div>
                                <div className="text-xl">
                                    {transactionsSummaryData
                                        ? converterValorParaReal(transactionsSummaryData.profit)
                                        : <Skeleton className="h-6 w-[100px]"/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*ADD TRANSACTION WEB*/}
                    <div
                        className="hidden
                            xl:flex xl:flex-col xl:mx-auto xl:border xl:border-[#58667e1a] xl:rounded-lg xl:shadow-custom-heavy xl:w-5/6 xl:py-6
                            ">
                        <div
                            className='flex justify-center items-center text-2xl font-light mb-6'>
                            Adicionar Novo Gasto
                        </div>
                        <form onSubmit={handleSubmit(createTransaction)} className="">
                            <div className="flex items-center w-full gap-5 flex-wrap justify-center">
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
                                    {errors.name
                                        && <span className="text-xs text-red-500">{errors.name.message}</span>
                                    }
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
                                    {errors.value
                                        && <span className="text-xs text-red-500">{errors.value.message}</span>
                                    }
                                </div>
                                <div className="xl:w-2/5">
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
                                <div className="xl:w-2/5">
                                    <div className="text-gray-600">Dia do gasto</div>
                                    <input
                                        autoComplete={"off"}
                                        type={"text"}
                                        placeholder={getTodayDay()}
                                        className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                        {...register("dateDay")}
                                    />
                                    {errors.dateDay
                                        && <span className="text-xs text-red-500">{errors.dateDay.message}</span>
                                    }
                                </div>
                                <div className="xl:w-2/5">
                                    <div className="text-gray-600">
                                        Tipo<span className="text-red-500 text-xs"> *</span>
                                    </div>
                                    <select
                                        className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                        id="type"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        required
                                    >
                                        <option>Selecione o tipo</option>
                                        <option value="INCOME">Entrada</option>
                                        <option value="OUTCOME">Saida</option>
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
                                {createTransactionIsLoading
                                    ? <button
                                        className="flex items-center justify-center mt-5 h-12 w-1/3 cursor-pointer rounded-md text-white bg-gray-700"
                                        type={"submit"}
                                        disabled={true}>
                                        <Loader2 className="animate-spin"/>
                                    </button>
                                    : <button className="flex items-center justify-center mt-5 h-12 w-1/3 cursor-pointer rounded-md bg-slate-900 text-white
                              transition-all duration-75 ease-in-out
                              active:scale-95
                              hover:bg-gray-700"
                                              type={"submit"}>
                                        Adicionar
                                    </button>
                                }
                            </div>
                        </form>
                    </div>
                    {/*<div*/}
                    {/*    className="hidden*/}
                    {/*        lg:block lg:px-2 lg:border lg:border-gray-100 lg:rounded-lg lg:shadow-custom-heavy lg:w-[95%] lg:py-4 lg:mt-3*/}
                    {/*        xl:w-5/6*/}
                    {/*        2xl:w-4/5*/}
                    {/*        3xl:w-3/5"*/}
                    {/*>*/}
                    {/*    <div className='flex'>*/}
                    {/*        <div className='flex justify-center items-center text-xl ml-10'>*/}
                    {/*            Importar Gastos:*/}
                    {/*        </div>*/}
                    {/*        <div className='flex items-center justify-center ml-5 gap-5'>*/}
                    {/*            <div*/}
                    {/*                className='flex justify-center items-center px-2 py-2 text-lg border-l border-[#8A05BE] cursor-pointer*/}
                    {/*                hover:bg-[#F1F5F9]'*/}
                    {/*            >*/}
                    {/*                Nubank*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*{isDragDropOpen &&*/}
                    {/*    <div>*/}
                    {/*        <DragDrop onFileConverted={handleFiles}/>*/}
                    {/*    </div>*/}
                    {/*}*/}
                </div>
                <div className="flex flex-col overflow-auto mb-3
                lg:w-[90%] lg:mx-auto
                xl:w-1/2 xl:mt-8
                3xl:w-[35%] 3xl:mx-0">
                    {/*TRANSACTION LIST FILTER*/}
                    <div className="flex px-3 mb-2 gap-1">
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
                    {/*TRANSACTION LIST*/}
                    <ScrollArea
                        type={"always"}
                        className="px-3">
                        {transactionsData?.length === 0 && (
                            <div className="flex items-center text-lg border-l-2 border-l-gray-500 px-6 h-12">
                                Adicione novos gastos para aparecerem aqui
                            </div>
                        )}
                        {sortBy === "tag"
                            ? <TransactionTagCard transactionsData={transactionsData}/>
                            : transactionsData
                                ?
                                transactionsData
                                    ?.filter((transaction) => {
                                        if (filterValue === "") {
                                            return true;
                                        }
                                        return transaction.tag.name === filterValue;
                                    })
                                    .sort((a, b) => {
                                        if (sortBy === "tag") {
                                            const tagA = a.tag?.name || "";
                                            const tagB = b.tag?.name || "";
                                            if (tagA < tagB) return -1;
                                            if (tagA > tagB) return 1;
                                            return 0;
                                        } else {
                                            const dateComparison =
                                                new Date(a.transaction_date).getTime() -
                                                new Date(b.transaction_date).getTime();
                                            if (dateComparison !== 0) {
                                                return dateComparison;
                                            }
                                            const tagA = a.tag?.name || "";
                                            const tagB = b.tag?.name || "";
                                            if (tagA < tagB) return -1;
                                            if (tagA > tagB) return 1;
                                            return 0;
                                        }
                                    })
                                    .map((transaction, index) => {
                                        return (
                                            <TransactionCard
                                                key={index}
                                                index={index}
                                                transaction={transaction}
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
            {/*HEADER MOBILE*/}
            <header
                className="flex justify-between items-center gap-3 h-20 px-5 shadow-custom-heavy-top
                xl:hidden">
                <div
                    className="w-1/5 h-12 flex items-center justify-center border border-gray-500 rounded
                    transition-all duration-75 ease-in-out
                    active:scale-95 active:bg-gray-100
                    lg:w-1/6"
                    onClick={handleGoHome}
                >
                    <HomeIcon className="flex items-center justify-center w-8 text-gray-700"/>
                </div>
                <div className="flex flex-1 justify-center items-center h-12
                lg:w-1/2">
                    <MobileCreateTransactionDialog
                        tags={tagsData}
                        onSubmit={createTransaction}
                        isLoading={createTransactionIsLoading}
                        tag={tag}
                        setTag={setTag}
                        type={type}
                        setType={setType}
                    />
                </div>
                <div className='flex items-center justify-center w-1/5 h-12'>
                    <ImportCsvDialog handleImportCsv={handleImportCsv}/>
                </div>
            </header>
        </main>
    );
}
