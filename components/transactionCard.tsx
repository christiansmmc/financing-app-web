import {capitalize, converterValorParaReal} from "@/utils/stringUtils";
import {TrashIcon} from "@heroicons/react/24/outline";
import {TransactionType} from "@/types/transactions";
import { Loader2 } from "lucide-react";

import {useDeleteTransactionMutation} from "@/api/transactions";

interface TransactionCardProps {
    id: number
    name: string,
    description?: string,
    value: number,
    transactionType: TransactionType,
    index: number,
    day: string,
    tag?: string
}

const TransactionCard = ({
                             id,
                             name,
                             description,
                             value,
                             transactionType,
                             index,
                             day,
                             tag
                         }: TransactionCardProps) => {
        
    const {
        mutate: deleteTransactionMutate, 
        isLoading: isLoadingDeleteTransaction
    } = useDeleteTransactionMutation();                      
                            
    return (
        <div
            key={index}
            className={`flex justify-around items-center h-16 w-full gap-4 px-2 border-l-2 mb-2 flex-shrink-0 border border-gray-100 rounded shadow-custom-light
            xl:pr-4
            ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray'} 
            ${transactionType === TransactionType.INCOME ? 'border-l-green-500' : 'border-l-red-500'}`}
        >
            <div className={"text-xs"}>
                Dia {day}
            </div>
            <div className={"flex-1"}>
                <div>{capitalize(name)}</div>
                <div className={"text-xs hidden md:block lg:hidden xl:block"}>{capitalize(description ?? "")}</div>
            </div>
            <div>
                {tag &&
                    <div className={"text-xs font-bold border border-blue-300 rounded p-1 bg-blue-50"}>
                        {tag}
                    </div>
                }
            </div>
            <div className={`w-2/12 text-left xl:mr-10
            ${transactionType === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                {converterValorParaReal(value)}
            </div>
            <div className={"flex gap-3"}>
                {/* <EditProfileDialog
                    id={id}
                    name={name}
                    description={description ?? ""}
                    value={value}
                    index={index}
                    editTransaction={() => console.log()}/> */}
                <div onClick={() => deleteTransactionMutate(id)}>
                    {!isLoadingDeleteTransaction 
                    ? <TrashIcon className="h-6 cursor-pointer "/>
                : <Loader2 className="animate-spin"/>}
                </div>
            </div>
        </div>
    )
};

export default TransactionCard;