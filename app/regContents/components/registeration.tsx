'use client';
import React, { useEffect, useRef, useState, } from 'react';
import { Category, Knowhow, KnowhowDetailInfo, KnowhowType, Tag, ThumbnailType } from '@prisma/client';
import { RegiGeneral } from './regiGeneral';
import { RegiYoutube } from './regiYoutube';
import { RegiImages } from './regiImages';
import { createChildKnowHowWithDetailAction, createKnowhowWithDetailInfoAction, updateKnowHowWithDetailInfoAction } from '@/app/actions/knowhowAction';
import { RegiText } from './regiText';
import { RegiPdfFiles } from './regiPdfFiles';
import { useRouter } from 'next/navigation';
import { getCloudinaryImgData, getCloudinaryPdfData, } from '@/app/lib/arrayLib';
import { consoleLogFormDatas } from '@/app/lib/formdata';

type RegProps = {
    categories: Category[],
    knowHowTypes: KnowhowType[],
    tags: Tag[],
    parentKnowhowId: string | undefined,
    knowhow: any | Knowhow | undefined,
    editMode: boolean | undefined,
};

const Registeration = ({ categories, knowHowTypes, tags, parentKnowhowId, knowhow, editMode }: RegProps) => {

    const router = useRouter();
    const [showDetail, setShowDetail] = useState(false);
    const [genFormData, setGenFormData] = useState<any>();
    const [ytData, setYtData] = useState<any[]>(knowhow?.knowhowDetailInfo?.youtubeDatas);
    const [imgFormData, setImgFormData] = useState<any[]>([]);
    const [pdfFormData, setPdfFormData] = useState<any[]>([]);
    const [text, setText] = useState('');
    const regGenRef = useRef<any>(null);
    const ytRef = useRef<any>(null);
    const imgRef = useRef<any>(null);
    const pdfFileRef = useRef<any>(null);
    const textRef = useRef<any>(null);
    const [showYoutube, setShowYoutube] = useState(false);
    const [showImg, setShowImg] = useState(false);
    const [showFile, setShowFile] = useState(false);
    const [showTextEditor, setShowTextEditor] = useState(false);
    const [parentId, setParentId] = useState('');
    const [knowhowSelected, setKnowhowSelected] = useState<Knowhow | undefined>();
    const imgCloudinaryData = getCloudinaryImgData(knowhow);
    const [imgCdIds, setImgCdIds] = useState<string[]>(imgCloudinaryData ? imgCloudinaryData.map((s: any) => s.id) : []);
    const pdfCloudinaryData = getCloudinaryPdfData(knowhow);
    const [pdfCdIds, setPdfCdIds] = useState<string[]>(pdfCloudinaryData ? pdfCloudinaryData.map((s: any) => s.id) : []);

    useEffect(() => {
        if (parentKnowhowId) {
            setParentId(parentKnowhowId);
        }
        if (knowhow) {
            setKnowhowSelected(knowhow);
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
            let uniqueCdIds = [...imgCdIds, ...pdfCdIds];
            console.log('ytData0', ytData)
            await updateKnowHowWithDetailInfoAction(knowhowSelected, genFormData, knowhowDetailInfo, ytData, uniqueCdIds, imgFormData, pdfFormData);
        }
        else {
            if (parentId) {
                await createChildKnowHowWithDetailAction(parentId, genFormData, knowhowDetailInfo, ytData, imgFormData, pdfFormData);
                router.push(`/regContents/?knowhowId=${parentId}`);
            } else {
                await createKnowhowWithDetailInfoAction(genFormData, knowhowDetailInfo, ytData, imgFormData, pdfFormData);
            }
        }
        router.push('/');
    };
    const handleCancelBtnClick = () => {
        router.push('/');
    };

    const handleMouseLeaveGenInfo = () => {
        regGenRef.current?.handleSubmit();
    };
    const handleMouseLeaveOnYtFile = () => {
        ytRef.current?.handleSubmit();
    };
    const handleMouseLeaveOnImgFile = () => {
        imgRef.current?.handleSubmit();
    };
    const handleMouseLeaveOnPdfFile = () => {
        pdfFileRef.current?.handleSubmit();
    };
    const handleMouseLeaveOnText = () => {
        textRef.current?.handleSubmit();
    };
    const getFormGenData = (data: any) => {
        setGenFormData(data);
    };
    const getYtData = (data: any) => {
        const { ytData, ytDataIdsToDelete } = data;
        setYtData(ytData);
        console.log('ytData: ', ytData);
    };
    const getImgFormData = (data: any) => {
        setImgCdIds([]);
        const { cdIds, imgFormdata } = data;
        consoleLogFormDatas('image formdata in registration:', imgFormData);
        setImgFormData(imgFormdata);
        setImgCdIds(cdIds);
        console.log('img cdIds: ', imgCdIds);

    };
    const getPdfFiles = (data: any) => {
        setPdfCdIds([]);
        const { cdIds, pdfFormdata } = data;
        setPdfFormData(pdfFormdata);
        consoleLogFormDatas('pdf formdata in registration:', pdfFormdata);
        setPdfCdIds(cdIds);
        console.log('pdf cdIds: ', pdfCdIds);
    };
    const getTextData = (textData: any) => {
        setText(textData);
    };

    return (
        <>
            <div className='mt-3'>
                <button className='me-3 btn btn-primary' onClick={handleSaveBtnClick} type="submit">저장</button>
                <button className='btn btn-secondary' onClick={handleCancelBtnClick} type="submit">취소</button>
            </div>
            <div onMouseLeave={handleMouseLeaveGenInfo}>
                <RegiGeneral ref={regGenRef} setRegDataToSave={getFormGenData} categories={categories} knowHowTypes={knowHowTypes} tags={tags} knowhow={knowhow} editMode={editMode} thumbnailCloudinaryData={knowhow?.thumbnailCloudinaryData} />
            </div>
            <div className='mt-3'>
                <button type="button" className="btn btn-success me-3" onClick={() => { regGenRef.current?.handleSubmit(); setShowDetail(!showDetail); setShowYoutube(true); setShowImg(false); setShowFile(false); setShowTextEditor(false); }}>
                    {editMode ? (<>{showDetail ? (<div>세부사항 숨기기</div>) : (<div>세부사항 변경하기</div>)}</>) : (<>{showDetail ? (<div>세부사항 숨기기</div>) : (<div>세부사항 등록하기</div>)}</>)}
                </button>
            </div>
            {showDetail && (
                <div>
                    <div className='mt-3' onMouseLeave={handleMouseLeaveOnYtFile}>
                        <p onClick={() => { setShowYoutube(!showYoutube); setShowImg(false); setShowFile(false); setShowTextEditor(false); }}><span className='btn btn-light'>{editMode ? (<>유튜브 변경하기</>) : (<>유튜브 등록하기</>)}</span></p>
                        <RegiYoutube ref={ytRef} setRegDataToSave={getYtData} showYtInput={showYoutube} initialYtData={ytData} editMode={editMode} />
                    </div>
                    <div className='mt-3' onMouseLeave={handleMouseLeaveOnImgFile}>

                        <p onClick={() => { setShowImg(!showImg); setShowYoutube(false); setShowFile(false); setShowTextEditor(false); }}><span className='btn btn-light'>  {editMode ? (<>이미지 변경하기</>) : (<>이미지 등록하기</>)}</span></p>
                        <RegiImages ref={imgRef} setRegDataToSave={getImgFormData} showImg={showImg} imgCloudinaryData={imgCloudinaryData} editMode={editMode} />
                    </div>
                    <div className='mt-3' onMouseLeave={handleMouseLeaveOnPdfFile}>
                        <p onClick={() => { setShowFile(!showFile); setShowImg(false); setShowYoutube(false); setShowTextEditor(false); }}><span className='btn btn-light'>{editMode ? (<>PDF 파일 변경하기</>) : (<>PDF 파일 등록하기</>)}</span></p>
                        <RegiPdfFiles ref={pdfFileRef} setRegDataToSave={getPdfFiles} showFileInput={showFile} pdfCloudinaryData={pdfCloudinaryData} editMode={editMode} />
                    </div>
                    <div className='mt-3' onMouseLeave={handleMouseLeaveOnText}>
                        <p onClick={() => { setShowTextEditor(!showTextEditor); setShowFile(false); setShowImg(false); setShowYoutube(false); }}><span className='btn btn-light'>{editMode ? (<>텍스트와 이미지 변경하기</>) : (<>텍스트와 이미지 등록하기</>)}</span></p>
                        <RegiText ref={textRef} setRegDataToSave={getTextData} showTextEditor={showTextEditor} textData={knowhow?.knowhowDetailInfo?.detailText} />
                    </div>
                </div>)}
            <div className='mt-3'>
                <button className='me-3 btn btn-primary' onClick={handleSaveBtnClick} type="submit">저장</button>
                <button className='btn btn-secondary' onClick={handleCancelBtnClick} type="submit">취소</button>
            </div>
        </>
    );
};

export default Registeration;