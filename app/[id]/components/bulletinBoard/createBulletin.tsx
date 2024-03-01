'use client'
import React, { useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import { Editor } from '@/components/controls/editor';
import { CanHandleSubmit } from '@/app/lib/types';


type CreateBulletinProps = {
    initialTitle: string | undefined | null,
    initialData: string | undefined,
    knowhowId: string,
    createBulletinAction: (formData: FormData) => void,

    // handleSaveData: () => void,
}
const CreateBulletin = ({ initialTitle, initialData, knowhowId, createBulletinAction }: CreateBulletinProps) => {
    const textRef = useRef<CanHandleSubmit>(null);

    const [title, setTitle] = useState<string>(initialTitle ? initialTitle : '')
    const [data, setData] = useState<string>(initialData ? initialData : '');
    const setTextData = (data: any) => {
        setData(data);
    };

    const handleMouseOut = () => {
        textRef.current?.handleSubmit();
    }
    const handleCreateBulletin = (formData: FormData) => {
        formData.append('message', data);
        createBulletinAction(formData)
    }

    return (
        <>
            <Form id="createBulletinForm" action={handleCreateBulletin}>
                <Form.Group controlId="title" className='mb-3'>
                    <Form.Label column="lg" lg={3}>
                        제목 <b className='danger'>*</b>
                    </Form.Label>
                    <Form.Control size="lg" type="text" required placeholder="게시판 제목을 입력하세요" name='title' />
                    <Form.Control.Feedback type="invalid">
                        제목을 입력하세요
                    </Form.Control.Feedback>
                </Form.Group>
                <div className='mt-3' onMouseOut={handleMouseOut}>
                    <Editor ref={textRef} setRegDataToSave={setTextData} initialData={data} initHeight='200px' />
                </div>
            </Form>
        </>
    )
}

export default CreateBulletin