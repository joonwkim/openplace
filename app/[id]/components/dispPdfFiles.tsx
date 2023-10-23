'use client';
import React, { forwardRef, useEffect, useState } from 'react';
import styles from '../page.module.css';

type FileProps = {
    pdfFileNames: string[];
};

export const DispPdfFiles = forwardRef<CanHandleSubmit, FileProps>((props: FileProps, ref) => {

    const { pdfFileNames } = props;

    const acceptedFileItems = pdfFileNames.map((file: any) => (
        <li className='list-group-item' key={file.path}>
            {/* {file.path} - {file.size} bytes */}
        </li>
    ));
    return (
        <>
            {pdfFileNames.length > 0 && (<>
                <h3 className='mt-3'>PDF 파일 </h3>
                {pdfFileNames && (JSON.stringify(pdfFileNames))}
            </>)}

            <aside>
                {acceptedFileItems.length > 0 && (
                    <>
                        <ul className="list-group mb-3" >{acceptedFileItems}</ul>
                    </>)}
            </aside>
        </>
    );
});
DispPdfFiles.displayName = "DispPdfFiles"




