'use client';
import React, { useEffect, useRef, useState, } from 'react';
import { Category, Knowhow, KnowhowDetailInfo, KnowhowType, MembershipRequestStatus, Tag, ThumbnailType } from '@prisma/client';
// import { RegiGeneral } from './regiGeneral';
import { createChildKnowHowWithDetailAction, createKnowhowWithDetailInfoAction, createKnowhowWithDetailInfoAndStageAction, updateKnowHowWithDetailInfoAction, updateStageProjectHeaderAndDetailAction } from '@/app/actions/knowhowAction';
import { useRouter } from 'next/navigation';
import { getCloudinaryImgData, getCloudinaryPdfData, } from '@/app/lib/arrayLib';
import { RegiOtherDatails } from './regiOtherDetails';
// import { RegiProjectStage } from './regiProjectStage';
import DisplayProjectStages from '@/app/knowhow/[id]/components/displayProjectStages';
import { Stage } from '@/app/lib/types';
// import { RegiProjectStages } from './regiProjectStages';
import { consoleLogFormData, consoleLogFormDatas } from '@/app/lib/formdata';
import { Header } from './headers/header';
import { SimpleHeader } from './headers/simpleHeader';
import { Detail } from './details/detail';
import { request } from 'http';
import { updateMembershipRequestAction } from '@/app/actions/membershipRequestAction';
import { ProjectStages } from './stages/projectStages';

export type RegProps = {
    categories: Category[],
    knowHowTypes: KnowhowType[],
    tags: Tag[],
    parentKnowhowId: string | undefined,
    knowhow: any | Knowhow | undefined,
    editMode: boolean | undefined,
    projectType: boolean | undefined,
    requestId?: string | undefined,
    status?: string | undefined
};

const Registeration = ({ categories, knowHowTypes, tags, parentKnowhowId, knowhow, editMode, projectType, requestId, status }: RegProps) => {

    const router = useRouter();
    const [showDetail, setShowDetail] = useState(true);
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
    const projectStagesRef = useRef<any>(null)
    const [parentId, setParentId] = useState('');
    const [knowhowSelected, setKnowhowSelected] = useState<Knowhow | undefined>();
    const imgCloudinaryData = getCloudinaryImgData(knowhow);
    const [imgCdIds, setImgCdIds] = useState<string[]>(imgCloudinaryData ? imgCloudinaryData.map((s: any) => s.id) : []);
    const pdfCloudinaryData = getCloudinaryPdfData(knowhow);
    const [pdfCdIds, setPdfCdIds] = useState<string[]>(pdfCloudinaryData ? pdfCloudinaryData.map((s: any) => s.id) : []);
    const [disableSaveBtn, setDisableSaveBtn] = useState(true)
    const [stages, setStages] = useState<Stage[]>([])
    const [rootThumnailUrl, setRootThumbnailUrl] = useState('')
    // const [stageProjectHeaderData, setStageProjectHeaderData] = useState<any>()
    // const [stageProjectDetailData, setStageProjectDetailData] = useState<any>()

    useEffect(() => {
        if (parentKnowhowId) {
            setParentId(parentKnowhowId);
        }
        if (knowhow) {
            setKnowhowSelected(knowhow);
            setIsProjectType(knowhow.isProjectType)
            // console.log('useEffect isProjectType', knowhow.isProjectType)
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
            console.log('knowhowSelected')
            let uniqueCdIds = [...imgCdIds, ...pdfCdIds];
            if (stages.length > 0) {
                console.log('stages.length > 0')
                stages.forEach(async (stage, stageIndex) => {
                    if (stage.children && stage.children.length > 0) {
                        stage.children.forEach(async (child, index) => {
                            if (index !== 0) {
                                console.log('update or create stage project knowhow')
                                // await updateStageProjectHeaderAndDetailAction(knowhowSelected, genFormData, knowhowDetailInfo, ytData, uniqueCdIds, imgFormData, pdfFormData, stage, child, child.StageProject?.StageProjectHeaderData, child.StageProject?.StageProjectDetailData);
                            }
                        })
                    }
                });

            } else {
                console.log('stages.length === 0')
                // await updateKnowHowWithDetailInfoAction(knowhowSelected, genFormData, knowhowDetailInfo, ytData, uniqueCdIds, imgFormData, pdfFormData);
            }
        }
        else {
            console.log('not knowhowSelected')
            if (parentId) {
                // await createChildKnowHowWithDetailAction(parentId, genFormData, knowhowDetailInfo, ytData, imgFormData, pdfFormData);
                if (requestId) {
                    if (status === 'JOINED') await updateMembershipRequestAction(requestId, MembershipRequestStatus.JOINED);
                    // if (status === 'APPROVED') await updateMembershipRequestAction(requestId, MembershipRequestStatus.APPROVED);
                }
                // router.push(`/regContents/?knowhowId=${parentId}`);
            } else {
                if (stages.length > 0) {
                    stages.forEach(async stage => {
                        // await createKnowhowWithDetailInfoAndStageAction(genFormData, knowhowDetailInfo, ytData, imgFormData, pdfFormData, stages);
                    })
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
    const handleMouseOutGenInfo = () => {
        // console.log('mouse out')
        regGenRef.current?.handleSubmit();
    };

    const handleMouseLeaveOtherDetails = () => {
        regOtherDetailsRef.current?.handleSubmit();
    };

    const getFormGenData = (data: any) => {
        const { otherFormData, thumbNailFormData, canDisable } = data;

        const file = otherFormData?.get('file')
        setRootThumbnailUrl(file?.secure_url)

        otherFormData?.append('isProjectType', isProjectType);
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

    const getProjectStageData = (data: Stage[]) => {
        // console.log('getProjectStageData', data)
        setStages(data)
    // setStageProjectHeaderData(stageProjectHeaderData)
    // setStageProjectDetailData(stageProjectDetailData)
    }
    const handleMouseLeaveOnRegiProjectStages = () => {
        projectStagesRef.current?.handleSubmit();
    }
    return (
        <>
            <div className='mt-3'>
                <button className='me-3 btn btn-primary' disabled={disableSaveBtn} onClick={handleSaveBtnClick} type="submit">저장</button>
                <button className='btn btn-secondary' onClick={handleCancelBtnClick} type="submit">취소</button>
            </div>

            <div onMouseOut={handleMouseOutGenInfo}>
                {parentKnowhowId ? (<SimpleHeader ref={regGenRef} setRegDataToSave={getFormGenData} knowhow={knowhow} />) : (<Header ref={regGenRef} setRegDataToSave={getFormGenData} categories={categories} knowHowTypes={knowHowTypes} tags={tags} knowhow={knowhow} editMode={editMode} thumbnailCloudinaryData={knowhow?.thumbnailCloudinaryData} />)}
            </div>

            {showProjectStages &&
                <div onMouseLeave={handleMouseLeaveOtherDetails}>

                </div>}
            {showDetail &&
                <div onMouseLeave={handleMouseLeaveOtherDetails}>
                    <Detail ref={regOtherDetailsRef} setRegDataToSave={getOtherDetails} knowhow={knowhow} editMode={editMode} />

                </div>}
            {/* <DisplayProjectStages /> */}
            {/* <div onMouseLeave={handleMouseLeaveOnRegiProjectStages}>
                <ProjectStages ref={projectStagesRef} setRegDataToSave={getProjectStageData} rootThumbnailUrl={rootThumnailUrl} knowhow={knowhow} editMode={editMode} />
            </div> */}
            {/* <div onMouseLeave={handleMouseLeaveOnRegiProjectStages}>
                <RegiProjectStages ref={regiProjectStagesRef} setRegDataToSave={getProjectStageData} rootThumbnailUrl={rootThumnailUrl} knowhow={knowhow} editMode={editMode} />
            </div> */}
            <div className='mt-3'>
                {/* <button className='me-3 btn btn-primary' disabled={disableSaveBtn} onClick={handleSaveBtnClick} type="submit">저장</button> */}
                <button className='me-3 btn btn-primary' onClick={handleSaveBtnClick} type="submit">저장</button>
                <button className='btn btn-secondary' onClick={handleCancelBtnClick} type="submit">취소</button>
            </div>


        </>
    );
};

export default Registeration;


