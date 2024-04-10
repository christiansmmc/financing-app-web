import {capitalize, converterValorParaReal} from "@/utils/stringUtils";
import {TrashIcon} from "@heroicons/react/24/outline";
import EditProfileDialog from "@/components/dialog/EditProfileDialog";
import {TransactionType} from "@/types/transactions";

interface TransactionCardProps {
    id: number
    name: string,
    description?: string,
    value: number,
    transactionType: TransactionType,
    index: number,
    deleteTransaction: (id: number) => void,
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
                             deleteTransaction,
                             day,
                             tag
                         }: TransactionCardProps) => {

    return (
        <div
            key={index}
            className={`flex justify-around items-center h-16 w-full gap-4 px-2 border-l-2 mb-2 flex-shrink-0
            xl:pr-4
            ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'} 
            ${transactionType === TransactionType.INCOME ? 'border-l-green-500' : 'border-l-red-500'}`}
        >
            <div className={"text-xs"}>
                Dia {day}
            </div>
            <div className={"flex-1"}>
                <div>{capitalize(name)}</div>
                <div className={"text-xs"}>{capitalize(description ?? "")}</div>
            </div>
            <div>
                {tag &&
                    <div className={"text-xs font-bold border rounded p-1 bg-blue-300"}>
                        {tag}
                    </div>
                }
            </div>
            <div className={`w-2/12 text-left xl:mr-10
            ${transactionType === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                {converterValorParaReal(value)}
            </div>
            <div className={"flex gap-3"}>
                <EditProfileDialog
                    id={id}
                    name={name}
                    description={description ?? ""}
                    value={value}
                    index={index}
                    editTransaction={() => console.log()}/>
                <div onClick={() => deleteTransaction(id)}>
                    {<TrashIcon className="h-6 cursor-pointer "/>}
                </div>
            </div>
        </div>
    )
};

export default TransactionCard;