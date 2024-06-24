import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useRouter} from "next/navigation";

const CreateMonthDialog = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const formattedCurrentMonth = currentMonth.toString().padStart(2, '0');

    const [month, setMonth] = useState(formattedCurrentMonth);
    const [year, setYear] = useState(currentYear.toString());

    const router = useRouter();

    const months = [
        {value: '01', name: 'Janeiro'},
        {value: '02', name: 'Fevereiro'},
        {value: '03', name: 'Março'},
        {value: '04', name: 'Abril'},
        {value: '05', name: 'Maio'},
        {value: '06', name: 'Junho'},
        {value: '07', name: 'Julho'},
        {value: '08', name: 'Agosto'},
        {value: '09', name: 'Setembro'},
        {value: '10', name: 'Outubro'},
        {value: '11', name: 'Novembro'},
        {value: '12', name: 'Dezembro'},
    ];

    const years = [currentYear - 1, currentYear, currentYear + 1];

    const enterNewSheet = () => {
        router.push(`/${year}-${month}`)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center justify-center h-10 cursor-pointer px-5 rounded-md transition-all duration-300 ease-in-out active:scale-95 bg-slate-900 text-white w-4/5 max-w-md
                    hover:bg-gray-700
                    lg:w-1/2
                    xl:2-1/3">
                    Adicionar mês
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crie uma nova planilha</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        enterNewSheet()
                    }}>
                    <div className={"flex mt-5 mb-2 gap-5"}>
                        <div>
                            <select
                                id="month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                required>
                                <option value="">Selecione o mês</option>
                                {months.map(({value, name}) => (
                                    <option key={value} value={value}>{name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required>
                                <option value="">Selecione o ano</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type={"submit"} className={"text-md w-full h-12 mt-2"}>
                            Criar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateMonthDialog;