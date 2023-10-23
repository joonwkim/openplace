'use client';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import parser from 'html-react-parser';
import { Editor } from '@/components/controls/editor';

type FileProps = {
    showTextEditor: boolean;
    setRegDataToSave: (data: any) => void;
};

export const RegiText = forwardRef<CanHandleSubmit, FileProps>((props: FileProps, ref) => {

    const [data, setData] = useState<string>("");
    const { showTextEditor, setRegDataToSave } = props;
    const [showModal, setShowModal] = useState(false);
    const textRef = useRef<CanHandleSubmit>(null);
    // const Editor = dynamic(() => import('@/components/controls/simpleEditor'), { ssr: false, });
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
        // alert('setTextData:' + data);
        setData(data);
    };
    return (
        <>
            {showModal && (<Modal size='xl' show={showModal} dialogClassName="modal-90w modal-centered" onHide={() => { textRef.current?.handleSubmit(); setShowModal(false); }} >
                <Modal.Header closeButton>
                    <Modal.Title>
                        세부 내역을 입력하세요
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Editor ref={textRef} setRegDataToSave={setTextData} />
                    {/* <Editor ref={textRef} showTextEditor={showTextEditor} setRegDataToSave={setTextData} /> */}
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShowTextEditor(false)}>취소</Button>
                    <Button variant="primary" onClick={()=>handleSaveText}>저장</Button>
                </Modal.Footer> */}
            </Modal>)}
            {!showModal && (<div onClick={() => setShowModal(true)} >
                {data && (<p className='border rounded border-info p-3'>{parser(data)}</p>)}
            </div>)}

        </>
    );

});
RegiText.displayName = "RegiText";