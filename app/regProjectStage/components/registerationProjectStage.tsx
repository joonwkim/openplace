'use client';
import React, { useEffect, useRef, useState, } from 'react';
import { Category, Knowhow, KnowhowDetailInfo, KnowhowType, Tag, ThumbnailType } from '@prisma/client';
import { createChildKnowHowWithDetailAction, createKnowhowWithDetailInfoAction, createKnowhowWithProjects, updateKnowHowWithDetailInfoAction } from '@/app/actions/knowhowAction';
import { useRouter } from 'next/navigation';
import { getCloudinaryImgData, getCloudinaryPdfData, } from '@/app/lib/arrayLib';
import { RegiProjectStage } from './regiProjectStage';
import { RegiOtherDatails } from '@/app/regContents/components/regiOtherDetails';

export type RegProjectProps = {
    parentKnowhowId: string | undefined,
    knowhow: any | Knowhow | undefined,
    editMode: boolean | undefined,
    projectType: boolean | undefined,
    stage: number,
    level: number,
};

const RegisterationProjectStage = ({ parentKnowhowId, knowhow, editMode, projectType, stage, level }: RegProjectProps) => {

    const router = useRouter();
    const [showDetail, setShowDetail] = useState(false);
    const [showProjectStages, setShowProjectStages] = useState(false);
    const [hideProjectStageBtn, setHideProjectStageBtn] = useState(false)
    const [genFormData, setGenFormData] = useState<any>();
    const [ytData, setYtData] = useState<any[]>(knowhow?.knowhowDetailInfo?.youtubeDatas);
    const [imgFormData, setImgFormData] = useState<any[]>([]);
    const [pdfFormData, setPdfFormData] = useState<any[]>([]);
    const [text, setText] = useState('');
    const [isProjectType, setIsProjectType] = useState(false)
    const regiPSRef = useRef<any>(null);
    const regOtherDetailsRef = useRef<any>(null)
    const [parentId, setParentId] = useState('');
    const [knowhowSelected, setKnowhowSelected] = useState<Knowhow | undefined>();
    const imgCloudinaryData = getCloudinaryImgData(knowhow);
    const [imgCdIds, setImgCdIds] = useState<string[]>(imgCloudinaryData ? imgCloudinaryData.map((s: any) => s.id) : []);
    const pdfCloudinaryData = getCloudinaryPdfData(knowhow);
    const [pdfCdIds, setPdfCdIds] = useState<string[]>(pdfCloudinaryData ? pdfCloudinaryData.map((s: any) => s.id) : []);
    const [disableSaveBtn, setDisableSaveBtn] = useState(true)

    useEffect(() => {
        if (parentKnowhowId) {
            setParentId(parentKnowhowId);
        }
        if (knowhow) {
            setKnowhowSelected(knowhow);
            setIsProjectType(knowhow.isProjectType)
            console.log('useEffect isProjectType', knowhow.isProjectType)
            // setIsProjectType(knowhow.isProjectType)
        }
    }, [knowhow, parentKnowhowId]);

    const handleSaveBtnClick = async () => {
        const knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId"> = {
            thumbnailType: ThumbnailType.MEDIUM,
            detailText: text,
            youtubeDataIds: [],
            cloudinaryDataIds: []
        };
        if (knowhowSelected) {
        }
        else {
            if (parentId) {
                router.push(`/regContents/?knowhowId=${parentId}`);
            } else {
                if (isProjectType) {
                    await createKnowhowWithProjects(genFormData);
                } else {
                }
            }
        }
        router.push('/');
    };

    const handleCancelBtnClick = () => {
        router.push('/');
    };

    const handleMouseLeaveGenInfo = () => {
    };

    const handleMouseLeaveOtherDetails = () => {
        regOtherDetailsRef.current?.handleSubmit();
    };

    const getProjectStateData = (data: any) => {
    };

    const getOtherDetails = (data: any) => {
        const { ytData, imgFormData, imgCdIds, pdfFormData, pdfCdIds, text } = data;
        setImgFormData(imgFormData)
        setImgCdIds(imgCdIds);
        setPdfFormData(pdfFormData)
        setPdfCdIds(pdfCdIds);
        setText(text);
    };
    const getDetailBtn = () => {
        return (
            <>
                <button type="button" className="btn btn-success me-3" onClick={() => { setShowDetail(!showDetail); setIsProjectType(false) }}>
                    <div>기타 세부사항 변경하기</div>
                </button>
            </>
        )
    }

    return (<>
        <div>parentKnowhowId: {parentKnowhowId}</div>
        <div>editMode: {editMode}</div>
        <div>projectType: {projectType}</div>
        <div>Registeration: Project Stage</div>
        <div className='mt-3'>
            <button className='me-3 btn btn-primary' disabled={disableSaveBtn} onClick={handleSaveBtnClick} type="submit">저장</button>
            <button className='btn btn-secondary' onClick={handleCancelBtnClick} type="submit">취소</button>
        </div>
        <div onMouseLeave={handleMouseLeaveGenInfo}>
            <RegiProjectStage ref={regiPSRef} setRegDataToSave={getProjectStateData} knowhow={null} editMode={false} thumbnailCloudinaryData={knowhow?.thumbnailCloudinaryData} />
        </div>
        <div className='mt-3'>
            <div>
                {getDetailBtn()}
            </div>
        </div>
        {showDetail &&
            <div onMouseLeave={handleMouseLeaveOtherDetails}>
                <RegiOtherDatails ref={regOtherDetailsRef} setRegDataToSave={getOtherDetails} parentKnowhowId={parentKnowhowId} knowhow={knowhow} editMode={editMode} />
            </div>}
        <div className='mt-3'>
            <button className='me-3 btn btn-primary' disabled={disableSaveBtn} onClick={handleSaveBtnClick} type="submit">저장</button>
            <button className='btn btn-secondary' onClick={handleCancelBtnClick} type="submit">취소</button>
        </div>
    </>
    )
};
export default RegisterationProjectStage;