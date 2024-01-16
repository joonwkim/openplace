'use client'
import React, { forwardRef, useImperativeHandle, useRef, useState, } from 'react';
import { RegiOtherDatails } from '@/app/regContents/components/regiOtherDetails';
import { RegiStageProjectHeader } from './regiStageProjectHeader';
import { Stage, StageProjectDetailData, StageProjectHeaderData } from '@/app/lib/types';

export type RegProps = {
    stage: Stage,
    setRegDataToSave: (data: any) => void,
};

export const RegiStageProject = forwardRef<any, RegProps>(({ stage, setRegDataToSave, }: RegProps, ref) => {

    const regiProjectKnowhowHeaderRef = useRef<any>(null);
    const regOtherDetailsRef = useRef<any>(null)
    const [stageProjectHeaderData, setStageProjectHeaderData] = useState<StageProjectHeaderData>()
    const [stageProjectDetailData, setStageProjectDetailData] = useState<StageProjectDetailData>()
    const [projectStage, setProjectStage] = useState(0)

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                setRegDataToSave({ stageProjectHeaderData, stageProjectDetailData, projectStage });
            }
        }),
    );

    const getProjectKnowhowHeaderData = ({ stageProjectHeaderData, stageProjectDetailData }: { stageProjectHeaderData: any, stageProjectDetailData: any }) => {
        setStageProjectHeaderData(stageProjectHeaderData)
        setStageProjectDetailData(stageProjectDetailData)
        // console.log('regi stage project data:', stageProjectHeaderData, stageProjectDetailData)
    };

    const getOtherDetails = (data: any) => {
        const { ytData, imgFormData, pdfFormData, text } = data;
        const detail: StageProjectDetailData = {
            ytData: ytData,
            imgData: imgFormData,
            pdfData: pdfFormData,
            text: text,
        }
        setStageProjectDetailData(detail);
        setProjectStage(stage.stage)
    };

    const handleOnMouseLeave = () => {
        regiProjectKnowhowHeaderRef.current?.handleSubmit()
        regOtherDetailsRef.current?.handleSubmit()
    }

    return (
        <>
            <div onMouseMove={handleOnMouseLeave}>
                <RegiStageProjectHeader ref={regiProjectKnowhowHeaderRef} setRegDataToSave={getProjectKnowhowHeaderData} stage={stage} />
            </div>
            <div onMouseLeave={handleOnMouseLeave}>
                <RegiOtherDatails ref={regOtherDetailsRef} setRegDataToSave={getOtherDetails} />
            </div>
        </>
    )
});

RegiStageProject.displayName = "RegiStageProject"