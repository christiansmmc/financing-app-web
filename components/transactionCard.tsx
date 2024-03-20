import {capitalize, converterValorParaReal} from "@/utils/stringUtils";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/outline";

interface TransactionCardProps {
    id: number
    name: string,
    description: string,
    value: number,
    index: number
    deleteTransaction: (id: number) => void
}

const TransactionCard = ({id, name, description, value, index, deleteTransaction}: TransactionCardProps) => {
    return (
        <div
            key={index}
            className={`flex justify-around items-center h-16 w-full gap-4 px-4 border-l-4 border-l-gray-500 ${
                index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'
            } rounded flex-shrink-0`}>
            <div className={"flex-1"}>
                <div>{capitalize(name)}</div>
                <div className={"text-sm"}>{capitalize(description)}</div>
            </div>
            <div
                className={"w-2/12 text-left text-red-500 mr-14"}>{converterValorParaReal(value)}</div>
            <div className={"w-1/12 text-center"}>
                {<PencilIcon className="h-6 cursor-pointer "/>}
            </div>
            <div onClick={() => deleteTransaction(id)} className={"w-1/12 text-center"}>
                {<TrashIcon className="h-6 cursor-pointer "/>}
            </div>
        </div>
    )
};

export default TransactionCard;