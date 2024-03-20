'use client'

import {UserCircleIcon} from "@heroicons/react/24/outline";
import {useCreateTransactionMutation, useDeleteTransactionMutation, useGetTransactionsQuery} from "@/api/transactions";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import TransactionCard from "@/components/transactionCard";

export default function Page({params}: { params: { date: string } }) {

    const {data} = useGetTransactionsQuery(params.date);
    const {mutate: createTransactionMutate} = useCreateTransactionMutation()
    const {mutate: deleteTransactionMutate} = useDeleteTransactionMutation()

    const CreateTransactionFormSchema = z.object({
        name: z.string().min(1, 'O campo nome é obrigatório'),
        description: z.string().optional(),
        value: z
            .string().min(1, "O campo valor é obrigatório")
            .regex(/^\d+([,]\d{1,2})?$/, 'O valor deve ser um número decimal com até 2 casas decimais')
            .transform((valor) => parseFloat(valor.replace(',', '.'))),
    });

    type CreateTransactionFormData = z.infer<typeof CreateTransactionFormSchema>;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm<CreateTransactionFormData>({
        resolver: zodResolver(CreateTransactionFormSchema)
    });


    const createTransaction = (data: CreateTransactionFormData) => {
        createTransactionMutate({
            name: data.name,
            description: data.description,
            value: data.value
        });

        reset()
    };

    const deleteTransaction = (id: number) => {
        deleteTransactionMutate(id)
    }

    return (
        <main className={"h-screen flex flex-col"}>
            <header className={"flex justify-around items-center shadow-md h-24 flex-shrink-0"}>
                <div className={"text-3xl font-semibold text-gray-700"}>Planilha de gastos</div>
                <div>
                    {<UserCircleIcon className={"w-11 text-gray-700 cursor-pointer"}/>}
                </div>
            </header>
            <div className={"flex my-10 overflow-auto justify-center"}>
                <div className={"flex flex-col items-center px-2 my-10 w-1/3 gap-10"}>
                    <div className={"border border-gray-300 w-3/5 rounded"}>
                        <div className={"p-10"}>
                            <div className={"flex flex-col gap-4 text-xl"}>
                                <div className={"flex justify-center mb-5"}>
                                    <div className={"text-gray-600 text-2xl underline"}>Abril 2024</div>
                                </div>
                                <div className={"flex justify-center gap-20"}>
                                    <div className={"w-1/3 text-left text-gray-600"}>Salário:</div>
                                    <div className={"w-1/3 text-left text-green-500"}>R$ 100,00</div>
                                </div>
                                <div className={"flex justify-center gap-20"}>
                                    <div className={"w-1/3 text-left text-gray-600"}>Gasto total:</div>
                                    <div className={"w-1/3 text-left text-red-500"}>R$ 1.000,00</div>
                                </div>
                                <div className={"flex justify-center gap-20"}>
                                    <div className={"w-1/3 text-left text-gray-600"}>Valor restante:</div>
                                    <div className={"w-1/3 text-left"}>R$ 10.000,00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(createTransaction)}
                          className={"border border-gray-300 w-3/5 rounded p-10 flex flex-col gap-5"}>
                        <div className={"flex justify-between gap-2"}>
                            <div className={"w-3/5"}>
                                <div className={"text-gray-600"}>Nome<span className={"text-red-500"}>*</span>
                                </div>
                                <input
                                    autoComplete={"off"}
                                    type={"text"}
                                    placeholder={"Digite aqui o nome"}
                                    className={"bg-gray-200 w-full h-10 rounded pl-2 text-sm"}
                                    {...register("name")}/>
                                {errors.name &&
                                    <span className={"text-sm text-red-500"}>{errors.name.message}</span>}
                            </div>
                            <div className={"w-2/5"}>
                                <div className={"text-gray-600"}>Valor<span className={"text-red-500"}>*</span>
                                </div>
                                <input
                                    autoComplete={"off"}
                                    type={"text"}
                                    placeholder={"Digite aqui o valor"}
                                    className={"bg-gray-200 w-full h-10 rounded pl-2 text-sm"}
                                    {...register("value")}/>
                                {errors.value &&
                                    <span className={"text-sm text-red-500"}>{errors.value.message}</span>}
                            </div>
                        </div>
                        <div>
                            <div className={"text-gray-600"}>Descrição</div>
                            <input
                                autoComplete={"off"}
                                type={"text"}
                                placeholder={"Digite aqui a descrição"}
                                className={"bg-gray-200 w-full h-10 rounded pl-2 text-sm"}
                                {...register("description")}/>
                        </div>
                        <button className={"w-full bg-blue-300 h-12 rounded mt-2 text-lg"}>
                            Adicionar gasto
                        </button>
                    </form>
                </div>
                <div className={"flex flex-col items-center w-1/3 gap-2 overflow-auto px-2 my-10"}>
                    {data?.map((transaction, index) => {
                        return <TransactionCard
                            key={index}
                            id={transaction.id}
                            name={transaction.name}
                            description={transaction.description}
                            value={transaction.value}
                            index={index}
                            deleteTransaction={deleteTransaction}
                        />
                    })}
                </div>
            </div>
        </main>
    );
}