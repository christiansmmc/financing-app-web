"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, {useState} from "react";
import {ArrowUpOnSquareIcon} from "@heroicons/react/24/outline";
import DragDrop from "@/components/dragdrop/DragDrop";

interface ImportCsvDialogProps {
    handleImportCsv: (file: { name: string; base64: string }) => void;
}

const ImportCsvDialog = ({handleImportCsv}: ImportCsvDialogProps) => {
    const [open, setOpen] = useState(false);

    const handleUpload = (file: { name: string; base64: string }) => {
        handleImportCsv(file)
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex justify-center items-center h-full w-full cursor-pointer rounded-md
                                transition-all duration-75 ease-in-out active:scale-95 bg-slate-900 text-white
                                hover:bg-gray-700">
                    <ArrowUpOnSquareIcon className="flex items-center justify-center w-8 text-white"/>
                </div>
            </DialogTrigger>
            <DialogContent className="w-[90%]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                        Import o .CSV da Fatura de seu cartão
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    No momento só temos suporte para faturas Nubank
                </DialogDescription>
                <div className='border border-dotted border-gray-700 p-5'>
                    <DragDrop onFileConverted={handleUpload}/>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImportCsvDialog;
