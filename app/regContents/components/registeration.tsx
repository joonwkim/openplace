'use client';
import React, { useEffect, useRef, useState, } from 'react';
import { Category, Knowhow, KnowhowDetailInfo, KnowhowType, Tag, ThumbnailType } from '@prisma/client';
import { RegiGeneral } from './regiGeneral';
import { RegiYoutube } from './regiYoutube';
import { RegiImages } from './regiImages';
import { createChildKnowHowWithDetailAction, createKnowHowWithDetailAction, updateKnowHowWithDetailAction } from '@/app/actions/knowhowAction';
import { RegiText } from './regiText';
import { RegiPdfFiles } from './regiPdfFiles';
import { useRouter } from 'next/navigation';
import { getImgUrls, getPdfUrls } from '@/app/lib/arrayLib';
import { EditMode } from '@/app/lib/convert';

type RegProps = {
    categories: Category[],
    knowHowTypes: KnowhowType[],
    tags: Tag[],
    parentKnowhowId: string | undefined,
    knowhow: Knowhow | undefined,
    editMode: boolean | undefined,
};

const Registeration = ({ categories, knowHowTypes, tags, parentKnowhowId, knowhow, editMode }: RegProps) => {

    const router = useRouter();
    const [showDetail, setShowDetail] = useState(false);
    const [genFormData, setGenFormData] = useState<any>();
    const [videoIds, setVideoIds] = useState<any>();
    const [imgFormData, setImgFormData] = useState<any[]>([]);
    const [imgFilenames, setImgFilenames] = useState<string[]>([]);
    const [pdfFormData, setPdfFormData] = useState<any[]>([]);
    const [pdfFilenames, setPdfFilenames] = useState<string[]>([]);
    const [text, setText] = useState('');
    const regGenRef = useRef<any>(null);
    const ytRef = useRef<any>(null);
    const imgRef = useRef<any>(null);
    const fileRef = useRef<any>(null);
    const textRef = useRef<any>(null);
    const [showYoutube, setShowYoutube] = useState(false);
    const [showImg, setShowImg] = useState(false);
    const [showFile, setShowFile] = useState(false);
    const [showTextEditor, setShowTextEditor] = useState(false);
    const [parentId, setParentId] = useState('');
    const [knowhowSelected, setKnowhowSelected] = useState<Knowhow | undefined>();

    // const imgUrls = getImgUrls(knowhow);
    // const pdfUrls = getPdfUrls(knowhow);

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
            videoIds: videoIds,
            thumbnailType: ThumbnailType.MEDIUM,
            imgFileNames: imgFilenames,
            pdfFileNames: pdfFilenames,
            detailText: text,
        };

        // alert('knowhowSelected' + JSON.stringify(knowhowSelected, null, 2));

        if (knowhowSelected) {
            await updateKnowHowWithDetailAction(knowhowSelected, genFormData, knowhowDetailInfo, imgFormData, pdfFormData);
        }
        else {
            if (parentId) {
                await createChildKnowHowWithDetailAction(parentId, genFormData, knowhowDetailInfo, imgFormData, pdfFormData);
                router.push(`/regContents/?knowhowId=${parentId}`);
            } else {
                alert('createKnowHowWithDetailAction');
                await createKnowHowWithDetailAction(genFormData, knowhowDetailInfo, imgFormData, pdfFormData);
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
    const handleMouseLeaveOnYtFile = () => {
        ytRef.current?.handleSubmit();
    };
    const handleMouseLeaveOnImgFile = () => {
        imgRef.current?.handleSubmit();
    };
    const handleMouseLeaveOnPdfFile = () => {
        fileRef.current?.handleSubmit();
    };
    const handleMouseLeaveOnText = () => {
        textRef.current?.handleSubmit();
    };

    const getFormGenData = (data: any) => {
        setGenFormData(data);
    };
    const getYtData = (videoIds: any) => {
        setVideoIds(videoIds);
    };
    const getImgFormData = (data: any) => {
        const { imgFilenames, imgFormdata } = data;
        setImgFilenames(imgFilenames);
        setImgFormData(imgFormdata);
    };
    const getPdfFiles = (data: any) => {
        const { pdfFilenames, pdfFormdata } = data;
        setPdfFilenames(pdfFilenames);
        setPdfFormData(pdfFormdata);
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

                <RegiGeneral ref={regGenRef} setRegDataToSave={getFormGenData} categories={categories} knowHowTypes={knowHowTypes} tags={tags} knowhow={knowhow} editMode={editMode} />
            </div>
            <div className='mt-3'>
                <button type="button" className="btn btn-success me-3" onClick={() => { regGenRef.current?.handleSubmit(); setShowDetail(!showDetail); setShowYoutube(true); setShowImg(false); setShowFile(false); setShowTextEditor(false); }}>{showDetail ? (<div>세부사항 숨기기</div>) : (<div>세부사항 등록하기</div>)}</button>
            </div>
            {showDetail && (
                <div>
                    <div className='mt-3' onMouseLeave={handleMouseLeaveOnYtFile}>
                        <p onClick={() => { setShowYoutube(!showYoutube); setShowImg(false); setShowFile(false); setShowTextEditor(false); }}><span className='btn btn-light'>유튜브 등록하기</span></p>
                        <RegiYoutube ref={ytRef} setRegDataToSave={getYtData} showYtInput={showYoutube} />
                    </div>
                    <div className='mt-3' onMouseLeave={handleMouseLeaveOnImgFile}>
                        <p onClick={() => { setShowImg(!showImg); setShowYoutube(false); setShowFile(false); setShowTextEditor(false); }}><span className='btn btn-light'>이미지 등록하기</span></p>
                        <RegiImages ref={imgRef} setRegDataToSave={getImgFormData} showImg={showImg} />
                    </div>
                    <div className='mt-3' onMouseLeave={handleMouseLeaveOnPdfFile}>
                        <p onClick={() => { setShowFile(!showFile); setShowImg(false); setShowYoutube(false); setShowTextEditor(false); }}><span className='btn btn-light'>PDF 파일 등록하기</span></p>
                        <RegiPdfFiles ref={fileRef} setRegDataToSave={getPdfFiles} showFileInput={showFile} />
                    </div>
                    <div className='mt-3' onMouseLeave={handleMouseLeaveOnText}>
                        <p onClick={() => { setShowTextEditor(!showTextEditor); setShowFile(false); setShowImg(false); setShowYoutube(false); }}><span className='btn btn-light'>텍스트와 이미지 등록하기</span></p>
                        <RegiText ref={textRef} setRegDataToSave={getTextData} showTextEditor={showTextEditor} />
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