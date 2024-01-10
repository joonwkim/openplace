'use client';
import React, { useEffect, useRef, useState, } from 'react';
import { Category, Knowhow, KnowhowDetailInfo, KnowhowType, Tag, ThumbnailType } from '@prisma/client';
import { RegiGeneral } from './regiGeneral';
import { createChildKnowHowWithDetailAction, createKnowhowWithDetailInfoAction, createKnowhowWithProjects, updateKnowHowWithDetailInfoAction } from '@/app/actions/knowhowAction';
import { useRouter } from 'next/navigation';
import { getCloudinaryImgData, getCloudinaryPdfData, } from '@/app/lib/arrayLib';
import { RegiOtherDatails } from './regiOtherDetails';

export type RegProps = {
    categories: Category[],
    knowHowTypes: KnowhowType[],
    tags: Tag[],
    parentKnowhowId: string | undefined,
    knowhow: any | Knowhow | undefined,
    editMode: boolean | undefined,
    projectType: boolean | undefined,
};

const Registeration = ({ categories, knowHowTypes, tags, parentKnowhowId, knowhow, editMode, projectType }: RegProps) => {

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
    const regGenRef = useRef<any>(null);
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
        console.log('handleSaveBtnClick')

        const knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId"> = {
            thumbnailType: ThumbnailType.MEDIUM,
            detailText: text,
            youtubeDataIds: [],
            cloudinaryDataIds: []
        };
        if (knowhowSelected) {
            let uniqueCdIds = [...imgCdIds, ...pdfCdIds];
            // console.log('ytData0', ytData)
            await updateKnowHowWithDetailInfoAction(knowhowSelected, genFormData, knowhowDetailInfo, ytData, uniqueCdIds, imgFormData, pdfFormData);
        }
        else {
            if (parentId) {
                await createChildKnowHowWithDetailAction(parentId, genFormData, knowhowDetailInfo, ytData, imgFormData, pdfFormData);
                router.push(`/regContents/?knowhowId=${parentId}`);
            } else {
                if (isProjectType) {
                    await createKnowhowWithProjects(genFormData);
                } else {

                    await createKnowhowWithDetailInfoAction(genFormData, knowhowDetailInfo, ytData, imgFormData, pdfFormData);
                }
            }
        }
        // router.push('/');
    };

    const handleCancelBtnClick = () => {
        router.push('/');
    };

    const handleMouseLeaveGenInfo = () => {
        regGenRef.current?.handleSubmit();
    };

    const handleMouseLeaveOtherDetails = () => {
        regOtherDetailsRef.current?.handleSubmit();
    };

    const getFormGenData = (data: any) => {
        const { otherFormData, thumbNailFormData, canDisable } = data;
        otherFormData?.append('isProjectType', isProjectType);
        console.log('canDisable:', canDisable)
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

    const handleAddProjectType = () => {
        // alert('handel project stage type')
        // router.push(`/regProjectStage/?parentKnowhowId=${knowhow.id}&editMode=false&isProjectType=true`);
        // router.push(`/regProjectStage/?parentKnowhowId=${knowhow?.id}&editMode=false&isProjectType=true&stage=0&level=0`);
    }
    const getProjectTypeBtn = () => {
        return (
            <>
                {editMode && !isProjectType ? (<></>) : !hideProjectStageBtn && (<>  <button type="button" className="btn btn-success me-3" onClick={() => { handleAddProjectType(); setShowDetail(false) }}>
                    <div>단계별 프로젝트 등록하기</div>
                </button></>)}
            </>
        )
    }
    const getDetailBtn = () => {
        return (
            <>
                {editMode && !isProjectType ? <button type="button" className="btn btn-success me-3" onClick={() => { regGenRef.current?.handleSubmit(); setShowDetail(!showDetail); setIsProjectType(false) }}>
                    {editMode ? (<>{showDetail ? (<div>기타 세부사항 숨기기</div>) : (<div>기타 세부사항 변경하기</div>)}</>) : (<>{showDetail ? (<div>기타 세부사항 숨기기</div>) : (<div>기타 세부사항 등록하기</div>)}</>)}
                </button> : !editMode ? (<><button type="button" className="btn btn-success me-3" onClick={() => { regGenRef.current?.handleSubmit(); setShowDetail(!showDetail); setIsProjectType(false) }}>
                    {editMode ? (<>{showDetail ? (<div>기타 세부사항 숨기기</div>) : (<div>기타 세부사항 변경하기</div>)}</>) : (<>{showDetail ? (<div>기타 세부사항 숨기기</div>) : (<div>기타 세부사항 등록하기</div>)}</>)}
                </button></>) : (<></>)}
            </>
        )
    }
    return (
        <>
            <div className='mt-3'>
                <button className='me-3 btn btn-primary' disabled={disableSaveBtn} onClick={handleSaveBtnClick} type="submit">저장</button>
                <button className='btn btn-secondary' onClick={handleCancelBtnClick} type="submit">취소</button>
            </div>
            <div onMouseLeave={handleMouseLeaveGenInfo}>
                <RegiGeneral ref={regGenRef} setRegDataToSave={getFormGenData} categories={categories} knowHowTypes={knowHowTypes} tags={tags} knowhow={knowhow} editMode={editMode} thumbnailCloudinaryData={knowhow?.thumbnailCloudinaryData} />
            </div>
            <div className='mt-3'>
                <div>
                    {getProjectTypeBtn()}
                    {getDetailBtn()}
                </div>
            </div>
            {showProjectStages &&
                <div onMouseLeave={handleMouseLeaveOtherDetails}>
                    {/* <RegiProjectStages /> */}
                </div>}
            {showDetail &&
                <div onMouseLeave={handleMouseLeaveOtherDetails}>
                    <RegiOtherDatails ref={regOtherDetailsRef} setRegDataToSave={getOtherDetails} parentKnowhowId={parentKnowhowId} knowhow={knowhow} editMode={editMode} />
                </div>}
            <div className='mt-3'>
                <button className='me-3 btn btn-primary' disabled={disableSaveBtn} onClick={handleSaveBtnClick} type="submit">저장</button>
                <button className='btn btn-secondary' onClick={handleCancelBtnClick} type="submit">취소</button>
            </div>
        </>
    );
};

export default Registeration;