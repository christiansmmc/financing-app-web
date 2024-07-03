import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import {GetTagsResponse} from "@/types/tags";
import {Loader2} from "lucide-react";
import React, {useState} from "react";
import {getTodayDay} from "@/utils/stringUtils";

interface MobileCreateTransactionDialogProps {
    tags: GetTagsResponse[] | undefined
    onSubmit: (data: CreateTransactionFormData) => void
    isLoading: boolean
    tag: string
    setTag: (tag: string) => void
    type: string
    setType: (type: string) => void
}

const CreateTransactionFormSchema = z.object({
    name: z.string().min(1, "O campo nome é obrigatório"),
    value: z.string().min(1, "O campo valor é obrigatório")
        .regex(/^\d+([,]\d{1,2})?$/, "O valor deve ser um número decimal com até 2 casas decimais")
        .transform((valor) => parseFloat(valor.replace(",", "."))),
    dateDay: z.string().max(2, "O campo dia só pode conter até 2 caracteres")
        .regex(/^(3[01]|[12][0-9]|0?[1-9])|^$/, "O campo só aceita números até o 31"),
    tagId: z.string().optional(),
    description: z.string().optional()
});

type CreateTransactionFormData = z.infer<typeof CreateTransactionFormSchema>;

const MobileCreateTransactionDialog = ({
                                           tags,
                                           onSubmit,
                                           isLoading,
                                           tag,
                                           setTag,
                                           type,
                                           setType
                                       }: MobileCreateTransactionDialogProps) => {
    const [open, setOpen] = useState(false);

    const {register, handleSubmit, formState: {errors}, reset} = useForm<CreateTransactionFormData>({
        resolver: zodResolver(CreateTransactionFormSchema),
    });

    const handleOpenDialog = () => {
        reset()
        setOpen(true);
    }

    const handleCreateTransaction = (data: CreateTransactionFormData) => {
        onSubmit(data)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button onClick={handleOpenDialog}
                        className="flex justify-center items-center h-10 w-5/6 cursor-pointer rounded-md
                                transition-all duration-200 ease-in-out active:scale-95 bg-slate-900 text-white
                                hover:bg-gray-700
                                sm:w-1/3">
                    Criar novo gasto
                </button>
            </DialogTrigger>
            <DialogContent className="w-5/6">
                <DialogHeader>
                    <DialogTitle className="text-center">Adicione um novo gasto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleCreateTransaction)}>
                    <div className="flex flex-col gap-5 mt-2">
                        <div>
                            <div>Nome<span className="text-red-500 text-xs"> *</span></div>
                            <input
                                autoComplete="off"
                                type="text"
                                placeholder="Digite aqui o nome"
                                className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                {...register("name")}
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </div>
                        <div>
                            <div className="text-gray-600">Valor<span className="text-red-500 text-xs"> *</span></div>
                            <input
                                autoComplete="off"
                                type="text"
                                placeholder="Digite aqui o valor"
                                className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                {...register("value")}
                            />
                            {errors.value && <span className="text-xs text-red-500">{errors.value.message}</span>}
                        </div>
                        <div>
                            <div className="text-gray-600">Categoria</div>
                            <select
                                className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                id="tag"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                required
                            >
                                <option>Selecione a categoria</option>
                                {tags?.map(({id, name}) => (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <div className="text-gray-600">Dia do gasto</div>
                            <input
                                autoComplete="off"
                                type="text"
                                placeholder={getTodayDay()}
                                className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                {...register("dateDay")}
                            />
                            {errors.dateDay && <span className="text-xs text-red-500">{errors.dateDay.message}</span>}
                        </div>
                        <div>
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
                        <div>
                            <div className="text-gray-600">Descrição</div>
                            <input
                                autoComplete="off"
                                placeholder="Digite aqui a descrição"
                                className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                                {...register("description")}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        {isLoading ? (
                            <button
                                className="flex items-center justify-center mt-5 h-10 cursor-pointer rounded-md text-white bg-gray-700"
                                disabled={true}>
                                <Loader2 className="animate-spin"/>
                            </button>
                        ) : (
                            <button className="flex items-center justify-center mt-5 h-10 w-full cursor-pointer rounded-md
                              transition-all duration-200 ease-in-out active:scale-95 bg-slate-900 text-white
                              hover:bg-gray-700"
                                    type={"submit"}>
                                Adicionar gasto
                            </button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default MobileCreateTransactionDialog;
