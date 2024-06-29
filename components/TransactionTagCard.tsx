import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Separator} from "@/components/ui/separator";
import {converterValorParaReal} from "@/utils/stringUtils";
import {GetTransactionResponse, TransactionType} from "@/types/transactions";
import {useMemo} from "react";

interface TransactionTagCardProps {
    transactionsData: GetTransactionResponse[] | undefined;
}

interface GroupedTransactions {
    [key: string]: GetTransactionResponse[];
}

const TransactionTagCard = ({transactionsData}: TransactionTagCardProps) => {

    const groupedTransactions = useMemo(() => {
        const groups: GroupedTransactions = {};

        transactionsData?.forEach(transaction => {
            const tagName = transaction.tag?.name || 'Outros';
            if (!groups[tagName]) {
                groups[tagName] = [];
            }
            groups[tagName].push(transaction);
        });
        return groups;
    }, [transactionsData]);

    return (
            <Accordion type="single" collapsible className="w-full">
                {Object
                    .keys(groupedTransactions)
                    .sort((a, b) => {
                        if (a === "Outros") {
                            return 1
                        }
                        if (b === "Outros") {
                            return -1
                        }
                        return a.localeCompare(b)
                    })
                    .map((transactionTag) => (
                        <AccordionItem value={transactionTag} key={transactionTag}>
                            <AccordionTrigger>
                                <div className="flex flex-1 items-center justify-between">
                                    <div>
                                        {transactionTag}
                                    </div>
                                    <div
                                        className={`w-2/12 text-left xl:mr-10 ${groupedTransactions[transactionTag].reduce((acc: any, transaction: any) => acc + (transaction.type === "OUTCOME" ? -transaction.value : transaction.value), 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {converterValorParaReal(groupedTransactions[transactionTag].reduce((acc: any, transaction: any) => acc + (transaction.type === "OUTCOME" ? -transaction.value : transaction.value), 0))}
                                    </div>
                                </div>
                            </AccordionTrigger>
                            {groupedTransactions[transactionTag]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((transaction: any) => (
                                <>
                                    <AccordionContent key={transaction.id}>
                                        <div className={"flex justify-between items-center px-2"}>
                                            <div>{transaction.name}</div>
                                            <div
                                                className={`${transaction.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}
                                            >
                                                {converterValorParaReal(transaction.value)}
                                            </div>
                                        </div>
                                        <Separator/>
                                    </AccordionContent>
                                </>
                            ))}
                        </AccordionItem>

                    ))}
            </Accordion>
    )
};

export default TransactionTagCard;