'use client';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import parser from 'html-react-parser';
import { CanHandleSubmit } from '@/app/lib/types';
import { Editor } from '@/components/controls/editor';

type FileProps = {
    showTextEditor: boolean,
    setRegDataToSave: (data: any) => void,
    textData: string,
};

export const Text = forwardRef<CanHandleSubmit, FileProps>((props: FileProps, ref) => {
    const { showTextEditor, setRegDataToSave, textData } = props;
    const [data, setData] = useState<string>(textData);

    const [showModal, setShowModal] = useState(false);
    const textRef = useRef<CanHandleSubmit>(null);
    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                textRef.current?.handleSubmit();
                setRegDataToSave(data);
            }
        }),
    );
    useEffect(() => {
        if (showTextEditor) {
            setShowModal(true);
        }
    }, [showTextEditor]);

    const setTextData = (data: any) => {
        setData(data);
    };
    return (
        <>
            {showModal && (
                <Modal size='xl' show={showModal} dialogClassName="modal-90w modal-centered" onHide={() => { textRef.current?.handleSubmit(); setShowModal(false); }} >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            세부 내역을 입력하세요
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Editor ref={textRef} setRegDataToSave={setTextData} initialData={data} />
                    </Modal.Body>
                </Modal>)}
            {!showModal && (<div onClick={() => setShowModal(true)}>
                {data && (<p className='border rounded border-info p-3'>{parser(data)}</p>)}
            </div>)}
        </>
    );
});
Text.displayName = "Text";