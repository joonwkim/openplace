'use client';
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import styles from '@/app/regContents/page.module.css';
import { DropzoneOptions, } from 'react-dropzone';
import FileUploader from '@/components/controls/fileUploader';
import { getFormdata } from '../lib/formData';
import { CloudinaryData } from '@prisma/client';

type FileProps = {
    showFileInput: boolean;
    setRegDataToSave: (data: any) => void,
    pdfCloudinaryData: CloudinaryData[],
    editMode: boolean | undefined,
};

export const RegiPdfFiles = forwardRef<any, FileProps>((props: FileProps, ref) => {

    const { showFileInput, setRegDataToSave, pdfCloudinaryData, editMode } = props;
    const foldername = 'openplace';
    const [files, setFiles] = useState<any[]>(pdfCloudinaryData);
    const [fileRejections, setFileRejections] = useState<any[]>([]);
    const [pdfFormdata, setPdfFormData] = useState<any[]>([]);
    const [cdIds, setCdIds] = useState<string[]>([]);

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                setCdIds([]);
                files.forEach(s => {
                    if (s.id) {
                        setCdIds(prev => [...prev, s.id]);
                    }
                });
                getFormData();
                setRegDataToSave({ cdIds, pdfFormdata });
            }
        }),
    );

    const onDrop = useCallback((acceptedFiles: any[], fileRejections: any[]) => {

        if (acceptedFiles.length === 1) {
            if (!files?.some(s => s.name === acceptedFiles[0].name)) {
                setFiles(prev => [...prev, acceptedFiles[0]]);
            }
        }
        else {
            acceptedFiles.forEach(file => {
                if (files?.length === 0 || !files?.some(s => s.name === file.name)) {
                    setFiles(prev => [...prev, file]);
                }
            });
        }
        setFileRejections(prev => [...prev, ...fileRejections]);
    }, [files]);

    const options: DropzoneOptions = {
        accept: { 'application/pdf': [], },
        maxSize: 10485760,
        onDrop
    };

    const getFormData = async () => {
        setPdfFormData([]);
        files?.forEach(async file => {
            if (!file.id) {
                const formData = await getFormdata(file, foldername);
                if (formData) {
                    setPdfFormData(prev => [...prev, formData]);
                }
            }

        });
    };

    const handleRemove = (indexToDelete: number) => {
        const cfs = files?.filter((file, i) => i !== indexToDelete);
        setFiles(cfs);
    };

    const acceptedFileItems = files?.map((file: any, index: number) => (
        <li className='list-group-item' key={index}>
            <div className='row'>
                <div className='col-4 mt-1'>{file.path}</div>
                <div className='col-1'><span className='btn btn-light' onClick={() => handleRemove(index)}>X</span></div>
            </div>
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, index, errors }: { file: any, index: number, errors: any; }) => (
        <li className='list-group-item' key={index}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <>
            {showFileInput && (<div className={`border border-primary ${styles.inputDropNoBg}`}>
                <FileUploader loaderMessage='파일을 끌어다 놓거나 선택하세요 ' dropMessage='가져다가 여기 놓으세요' options={options} />
            </div>)}
            <aside>
                {acceptedFileItems?.length > 0 && (<>
                    <ul className="list-group mb-3" >{acceptedFileItems}</ul>
                </>)}
                {fileRejectionItems?.length > 0 && (<>
                    <h6>허용되지 않는 파일(들)입니다.</h6>
                    <ul className="list-group">{fileRejectionItems}</ul>
                </>)}
            </aside>
        </>
    );
});
RegiPdfFiles.displayName = "RegiPdfFiles";
