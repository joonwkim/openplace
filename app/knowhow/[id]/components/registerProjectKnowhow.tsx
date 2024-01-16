'use client'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, } from 'react';
import { RegiProjectKnowhowHeader } from './regiProjectKnowhowHeader';
import { RegiOtherDatails } from '@/app/regContents/components/regiOtherDetails';
import { consoleLogFormData } from '@/app/lib/formdata';

export type RegProps = {
    setRegDataToSave: (data: any) => void,
    editMode: boolean | undefined,
    projectType: boolean | undefined,
};

export const RegisterProjectKnowhow = forwardRef<any, RegProps>(({ setRegDataToSave, editMode, projectType }: RegProps, ref) => {

    const regiProjectKnowhowHeaderRef = useRef<any>(null);
    const regOtherDetailsRef = useRef<any>(null)
    const [ytData, setYtData] = useState<any[]>([]);
    const [imgFormData, setImgFormData] = useState<any[]>([]);
    const [pdfFormData, setPdfFormData] = useState<any[]>([]);
    const [text, setText] = useState('');
    const [pdfCdIds, setPdfCdIds] = useState<string[]>([]);
    const [imgCdIds, setImgCdIds] = useState<string[]>([]);
    const [disableSaveBtn, setDisableSaveBtn] = useState(true)
    const [genFormData, setGenFormData] = useState<any>();

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                setRegDataToSave({ genFormData, ytData, imgFormData, pdfFormData, text });
            }
        }),
    );

    const getProjectKnowhowHeaderData = (data: any) => {
        const { otherFormData, thumbNailFormData, canDisable } = data;
        otherFormData?.append('isProjectType', 'true');

        // consoleLogFormData('otherformData:', otherFormData)
        // consoleLogFormData('thumbNailFormData:', thumbNailFormData)
        console.log('canDisable:', canDisable)
        // console.log('data:', data)



        setDisableSaveBtn(canDisable);
        setGenFormData(data);
    };

    const getOtherDetails = (data: any) => {
        const { ytData, imgFormData, imgCdIds, pdfFormData, pdfCdIds, text } = data;
        setYtData(ytData);
        setImgFormData(imgFormData)
        setImgCdIds(imgCdIds);
        setPdfFormData(pdfFormData)
        setPdfCdIds(pdfCdIds);
        setText(text);
    };

    const handleOnMouseLeave = () => {
        regiProjectKnowhowHeaderRef.current?.handleSubmit()
    }

    return (
        <>
            <div onMouseLeave={handleOnMouseLeave}>
                <RegiProjectKnowhowHeader ref={regiProjectKnowhowHeaderRef} setRegDataToSave={getProjectKnowhowHeaderData} />
            </div>

            {/* <RegiProjectKnowhowDetail /> */}
            <div onMouseLeave={handleOnMouseLeave}>
                <RegiOtherDatails ref={regOtherDetailsRef} setRegDataToSave={getOtherDetails} parentKnowhowId={''} knowhow={null} editMode={editMode} />
            </div>

        </>



    )
});

RegisterProjectKnowhow.displayName = "RegisterProjectKnowhow"