'use client';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, } from 'react';
import { getCloudinaryImgData, getCloudinaryPdfData, } from '@/app/lib/arrayLib';
import { consoleLogFormDatas } from '@/app/lib/formdata';
import { Knowhow } from '@prisma/client';
import { Youtube } from './details/youTube';
import { Images } from './details/images';
import { PdfFiles } from './details/pdfFiles';
import { Text } from './details/text'

type OtherDetailProps = {
  parentKnowhowId?: string | undefined,
  knowhow?: any | Knowhow | undefined,
  editMode?: boolean | undefined,
  setRegDataToSave: (data: any) => void,
}

export const RegiOtherDatails = forwardRef<any, OtherDetailProps>((props: OtherDetailProps, ref) => {

  const { parentKnowhowId, knowhow, editMode, setRegDataToSave } = props;
  const [ytData, setYtData] = useState<any[]>(knowhow?.knowhowDetailInfo?.youtubeDatas);
  const [imgFormData, setImgFormData] = useState<any[]>([]);
  const [pdfFormData, setPdfFormData] = useState<any[]>([]);
  const [text, setText] = useState('');
  const ytRef = useRef<any>(null);
  const imgRef = useRef<any>(null);
  const pdfFileRef = useRef<any>(null);
  const textRef = useRef<any>(null);
  const [showYoutube, setShowYoutube] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [showFile, setShowFile] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const imgCloudinaryData = getCloudinaryImgData(knowhow);
  const [imgCdIds, setImgCdIds] = useState<string[]>(imgCloudinaryData ? imgCloudinaryData.map((s: any) => s.id) : []);
  const pdfCloudinaryData = getCloudinaryPdfData(knowhow);
  const [pdfCdIds, setPdfCdIds] = useState<string[]>(pdfCloudinaryData ? pdfCloudinaryData.map((s: any) => s.id) : []);

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        setRegDataToSave({ ytData, imgFormData, imgCdIds, pdfFormData, pdfCdIds, text });
      }
    }),
  );

  useEffect(() => {
    setShowYoutube(true)
  }, [])
  

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

  const getYtData = (data: any) => {
    const { ytData, ytDataIdsToDelete } = data;
    setYtData(ytData);
  };

  const getImgFormData = (data: any) => {
    setImgCdIds([]);
    const { cdIds, imgFormdata } = data;
    setImgFormData(imgFormdata);
    setImgCdIds(cdIds);
  };

  const getPdfFiles = (data: any) => {
    setPdfCdIds([]);
    const { cdIds, pdfFormdata } = data;
    setPdfFormData(pdfFormdata);
    // consoleLogFormDatas('pdf formdata in registration:', pdfFormdata);
    setPdfCdIds(cdIds);
    // console.log('cdIds:', cdIds)
  };

  const getTextData = (textData: any) => {
    setText(textData);
    // console.log('text data:', textData)
  };

  return (
    <div>
      <div className='mt-3' onMouseLeave={handleMouseLeaveOnYtFile}>
        <p onClick={() => { setShowYoutube(!showYoutube); setShowImg(false); setShowFile(false); setShowTextEditor(false); }}><span className='btn btn-light'>{editMode ? (<>유튜브 변경하기</>) : (<>유튜브 등록하기</>)}</span></p>
        <Youtube ref={ytRef} setRegDataToSave={getYtData} showYtInput={showYoutube} initialYtData={ytData} editMode={editMode} />
      </div>
      <div className='mt-3' onMouseLeave={handleMouseLeaveOnImgFile}>
        <p onClick={() => { setShowImg(!showImg); setShowYoutube(false); setShowFile(false); setShowTextEditor(false); }}><span className='btn btn-light'>  {editMode ? (<>이미지 변경하기</>) : (<>이미지 등록하기</>)}</span></p>
        <Images ref={imgRef} setRegDataToSave={getImgFormData} showImg={showImg} imgCloudinaryData={imgCloudinaryData} editMode={editMode} />
      </div>
      <div className='mt-3' onMouseLeave={handleMouseLeaveOnPdfFile}>
        <p onClick={() => { setShowFile(!showFile); setShowImg(false); setShowYoutube(false); setShowTextEditor(false); }}><span className='btn btn-light'>{editMode ? (<>PDF 파일 변경하기</>) : (<>PDF 파일 등록하기</>)}</span></p>
        <PdfFiles ref={pdfFileRef} setRegDataToSave={getPdfFiles} showFileInput={showFile} pdfCloudinaryData={pdfCloudinaryData} editMode={editMode} />
      </div>
      <div className='mt-3' onMouseLeave={handleMouseLeaveOnText}>
        <p onClick={() => { setShowTextEditor(!showTextEditor); setShowFile(false); setShowImg(false); setShowYoutube(false); }}><span className='btn btn-light'>{editMode ? (<>텍스트와 이미지 변경하기</>) : (<>텍스트와 이미지 등록하기</>)}</span></p>
        <Text ref={textRef} setRegDataToSave={getTextData} showTextEditor={showTextEditor} textData={knowhow?.knowhowDetailInfo?.detailText} />
      </div>
    </div>
  )
});

RegiOtherDatails.displayName = "RegiOtherDatails";