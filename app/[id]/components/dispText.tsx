'use client';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Modal } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import parser from 'html-react-parser';

type FileProps = {
    detailText: string;
};

export const DispText = forwardRef<CanHandleSubmit, FileProps>((props: FileProps, ref) => {
    const { detailText } = props;
    const [data, setData] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        setData(detailText);
    }, [detailText]);
    return (
        <>
            {data && (<>
            <h3 className='mt-3'>텍스트와 이미지</h3>
            <p className='border rounded border-info p-3'>{parser(data)}</p>
            </>)}
        </>
    );
});
DispText.displayName = "DispText";