import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import {PencilIcon} from "@heroicons/react/24/outline";
import {Button} from "@/components/ui/button";

interface TransactionCardProps {
    id: number
    name: string,
    description: string,
    value: number,
    index: number
    editTransaction: (id: number, name: string, description: string, value: number) => void
}

const EditProfileDialog = ({id, name, description, value, index, editTransaction}: TransactionCardProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <PencilIcon className="h-6 cursor-pointer"/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edite os dados do gasto</DialogTitle>
                </DialogHeader>
                <div className={"flex flex-col gap-5 mt-2"}>
                    <div>
                        <div className={"text-gray-600"}>
                            Nome<span className={"text-red-500"}>*</span>
                        </div>
                        <input
                            autoComplete={"off"}
                            type={"text"}
                            placeholder={name}
                            className={"bg-gray-200 w-full h-10 rounded pl-2 text-sm"}/>
                    </div>
                    <div>
                        <div className={"text-gray-600"}>
                            Descrição<span className={"text-red-500"}>*</span>
                        </div>
                        <input
                            autoComplete={"off"}
                            type={"text"}
                            placeholder={description}
                            className={"bg-gray-200 w-full h-10 rounded pl-2 text-sm"}/>
                    </div>
                    <div>
                        <div className={"text-gray-600"}>
                            Valor<span className={"text-red-500"}>*</span>
                        </div>
                        <input
                            autoComplete={"off"}
                            type={"text"}
                            placeholder={value.toString()}
                            className={"bg-gray-200 w-full h-10 rounded pl-2 text-sm"}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button type={"submit"} className={"text-md w-full h-12 mt-2"}>
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileDialog;