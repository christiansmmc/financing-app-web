import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';

interface Base64File {
    name: string;
    base64: string;
}

interface DragDropProps {
    onFileConverted: (file: Base64File) => void;
}

const DragDrop: React.FC<DragDropProps> = ({onFileConverted}) => {
    const [base64File, setBase64File] = useState<Base64File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                const base64String = reader.result.split(',')[1];
                const newFile = {name: file.name, base64: base64String};
                setBase64File(newFile);
                onFileConverted(newFile);
            }
        };
    }, [onFileConverted]);

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {'text/csv': ['.csv']},
        maxFiles: 1
    });

    return (
        <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p>Arraste um arquivo CSV aqui ou clique para selecionar</p>
            </div>
        </section>
    );
};

export default DragDrop;
