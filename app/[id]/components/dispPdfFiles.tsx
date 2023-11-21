'use client';

import { CloudinaryData } from "@prisma/client";
import { JsonWebTokenError } from "jsonwebtoken";
import { useState } from "react";

type PDFProps = {
    initialPdfs: CloudinaryData[],
};

export const DispPdfFiles = (props: PDFProps) => {

    const { initialPdfs } = props;
    const [embedUrl, setEmbedUrl] = useState('');
    const [pdfs, setPdfs] = useState<CloudinaryData[]>(initialPdfs);

    // console.log('pdfs:', pdfs);

    const handleClick = (pdf: CloudinaryData) => {
        // alert(pdf?.secure_url);
        if (pdf?.secure_url) {
            setEmbedUrl(pdf?.secure_url);
        }
    };

    const acceptedFileItems = pdfs?.map((pdf: any, index: number) => (
        <li className='list-group-item' key={index} onClick={() => handleClick(pdf)}>
            {pdf?.path} - {pdf?.bytes} bytes
        </li>
    ));

    const handleHide = () => {
        setEmbedUrl('');
    };


    return (
        <>
            {pdfs?.length > 0 && (<>
                <h3 className='mt-3'>PDF 파일 </h3>
            </>)}
            {embedUrl &&
                <div>
                    <div className='fs-7'><button className='btn btn-primary-outline' type="button" onClick={handleHide}>PDF 숨기기</button></div>
                    <iframe src={embedUrl} width={854} height={480} title="Pdf" allowFullScreen></iframe>
                </div>}

            <aside>
                {acceptedFileItems?.length > 0 && (
                    <>
                        <ul className="list-group mb-3" >{acceptedFileItems}</ul>
                    </>)}
            </aside>
        </>
    );
};




