import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon } from "@heroicons/react/24/outline";
import { GetTransactionResponse } from "@/types/transactions";
import { useGetTagsQuery } from "@/api/tags";
import { useState } from "react";
import { getDayFromDate, updateDayInDateString } from "@/utils/stringUtils";
import { useUpdateTransactionMutation } from "@/api/transactions";
import { Loader2 } from "lucide-react";

interface TransactionCardProps {
  index: number;
  transaction: GetTransactionResponse;
}

const EditProfileDialog = ({ index, transaction }: TransactionCardProps) => {
  const [name, setName] = useState(transaction.name);
  const [value, setValue] = useState(
    transaction.value.toString().replace(".", ",")
  );
  const [tag, setTag] = useState("0");
  const [day, setDay] = useState(
    Number(getDayFromDate(transaction.transaction_date))
  );
  const [type, setType] = useState(transaction.type.toString());
  const [description, setDescription] = useState(transaction.description);
  const [error, setError] = useState({
    name: "",
    value: "",
    tag: "",
    day: "",
    type: "",
    description: "",
  });

  const { data: tagsData } = useGetTagsQuery();
  const {
    mutate: updateTransactionMutate,
    isLoading: updateTransactionIsLoading,
  } = useUpdateTransactionMutation();

  const setDefaultValues = () => {
    setName(transaction.name);
    setValue(transaction.value.toString().replace(".", ","));
    setTag("0");
    setDay(Number(getDayFromDate(transaction.transaction_date)));
    setType(transaction.type.toString());
    setDescription(transaction.description);

    setError({
      name: "",
      value: "",
      tag: "",
      day: "",
      type: "",
      description: "",
    });
  };

  const handleEditTransaction = () => {
    if (Object.values(error).some((error) => error !== "")) {
      return;
    }

    updateTransactionMutate({
      id: transaction.id,
      name: name,
      description: description,
      value: Number(value.replace(",", ".")),
      type: type,
      transaction_date: updateDayInDateString(
        transaction.transaction_date.toString(),
        day
      ),
      tag_id: tag != "0" ? parseInt(tag) : undefined,
    });
  };

  const handleSetName = (name: string) => {
    let errorMessage = "";

    if (name.length <= 0) {
      errorMessage = "Nome é obrigatório";
    }

    setError((prevError) => ({
      ...prevError,
      name: errorMessage,
    }));

    setName(name);
  };

  const handleSetValue = (value: string) => {
    let errorMessage = "";

    if (isNaN(Number(value.replace(",", ".")))) {
      errorMessage = "Valor deve ser um número";
    } else if (value.length <= 0) {
      errorMessage = "Valor é obrigatório";
    }

    setError((prevError) => ({
      ...prevError,
      value: errorMessage,
    }));

    setValue(value);
  };

  const handleSetDay = (day: number) => {
    let errorMessage = "";

    if (day <= 0 || day >= 32) {
      errorMessage = "Deve ser um dia válido";
    }

    setError((prevError) => ({
      ...prevError,
      day: errorMessage,
    }));

    setDay(day);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <PencilIcon onClick={setDefaultValues} className="h-6 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div>
          <div className="flex flex-col gap-5 mt-2">
            <div>
              <div>Nome</div>
              <input
                autoComplete="off"
                type="text"
                value={name}
                onChange={(e) => handleSetName(e.target.value)}
                className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
              />
              {error.name != "" && (
                <div className="text-sm mt-1 pl-1 border-l border-red-500">
                  {error.name}
                </div>
              )}
            </div>
            <div>
              <div className="text-gray-600">Valor</div>
              <input
                autoComplete="off"
                type="text"
                value={value.toString().replace(".", ",")}
                onChange={(e) => handleSetValue(e.target.value)}
                className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
              />
              {error.value != "" && (
                <div className="text-sm mt-1 pl-1 border-l border-red-500">
                  {error.value}
                </div>
              )}
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
                <option>
                  {transaction.tag?.name || "Selecione a categoria"}
                </option>
                {tagsData?.map(({ id, name }) => (
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
                type="number"
                value={day}
                onChange={(e) => handleSetDay(Number(e.target.value))}
                className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
              />
              {error.day != "" && (
                <div className="text-sm mt-1 pl-1 border-l border-red-500">
                  {error.day}
                </div>
              )}
            </div>
            <div>
              <div className="text-gray-600">Tipo</div>
              <select
                className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                defaultValue="OUTCOME"
                required
              >
                <option>Selecione o tipo</option>
                <option value="INCOME">Entrada</option>
                <option value="OUTCOME">Saida</option>
              </select>
            </div>
            <div>
              <div className="text-gray-600">Descrição</div>
              <input
                autoComplete="off"
                placeholder="Digite aqui a descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-50 border border-gray-100 shadow w-full h-10 rounded pl-2 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            {updateTransactionIsLoading ? (
              <button
                className="flex items-center justify-center mt-5 h-10 w-full cursor-pointer rounded-md text-white bg-gray-700"
                disabled={true}
              >
                <Loader2 className="animate-spin" />
              </button>
            ) : (
              <button
                className="flex items-center justify-center mt-5 h-10 w-full cursor-pointer rounded-md
                              transition-all duration-200 ease-in-out active:scale-95 bg-slate-900 text-white
                              hover:bg-gray-700"
                onClick={handleEditTransaction}
              >
                Editar gasto
              </button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
