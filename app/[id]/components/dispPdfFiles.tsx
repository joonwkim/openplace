'use client';

import { CloudinaryData } from "@prisma/client";
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
        alert(pdf?.path);
    };

    const acceptedFileItems = pdfs?.map((pdf: any, index: number) => (
        <li className='list-group-item' key={index} onClick={() => handleClick(pdf)}>
            {pdf?.path} - {pdf?.bytes} bytes
        </li>
    ));
    return (
        <>
            {pdfs?.length > 0 && (<>
                <h3 className='mt-3'>PDF 파일 </h3>
            </>)}

            <aside>
                {acceptedFileItems?.length > 0 && (
                    <>
                        <ul className="list-group mb-3" >{acceptedFileItems}</ul>
                    </>)}
            </aside>
        </>
    );
};




