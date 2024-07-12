import {
  capitalize,
  converterValorParaReal,
  getDayFromDate,
} from "@/utils/stringUtils";
import { TrashIcon } from "@heroicons/react/24/outline";
import { GetTransactionResponse, TransactionType } from "@/types/transactions";
import { Loader2 } from "lucide-react";

import { useDeleteTransactionMutation } from "@/api/transactions";
import EditProfileDialog from "./dialog/EditProfileDialog";

interface TransactionCardProps {
  index: number;
  transaction: GetTransactionResponse;
}

const TransactionCard = ({ index, transaction }: TransactionCardProps) => {
  const {
    mutate: deleteTransactionMutate,
    isLoading: isLoadingDeleteTransaction,
  } = useDeleteTransactionMutation();

  const handleDeleteTransaction = (id: number) => {
    deleteTransactionMutate(id);
  };

  return (
    <div
      key={index}
      className={`flex justify-around items-center h-16 w-full gap-4 px-2 border-l-2 mb-2 flex-shrink-0 border border-gray-100 rounded shadow-custom-light
            xl:pr-4
            ${index % 2 === 0 ? "bg-gray-50" : "bg-gray"} 
            ${
              transaction.type === TransactionType.INCOME
                ? "border-l-green-500"
                : "border-l-red-500"
            }`}
    >
      <div className={"text-xs"}>
        Dia {getDayFromDate(transaction.transaction_date)}
      </div>
      <div className={"flex-1"}>
        <div>{capitalize(transaction.name)}</div>
        <div className={"text-xs hidden md:block lg:hidden xl:block"}>
          {capitalize(transaction.description ?? "")}
        </div>
      </div>
      <div>
        {transaction.tag && (
          <div
            className={
              "text-xs font-bold border border-blue-300 rounded p-1 bg-blue-50"
            }
          >
            {transaction.tag.name}
          </div>
        )}
      </div>
      <div
        className={`w-1/6 text-left
            ${
              transaction.type === TransactionType.INCOME
                ? "text-green-500"
                : "text-red-500"
            }`}
      >
        {converterValorParaReal(transaction.value)}
      </div>
      <div className={"flex gap-3"}>
        <EditProfileDialog index={index} transaction={transaction} />
        <div onClick={() => handleDeleteTransaction(transaction.id)}>
          {!isLoadingDeleteTransaction ? (
            <TrashIcon className="h-6 cursor-pointer hover:text-red-600" />
          ) : (
            <Loader2 className="animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
