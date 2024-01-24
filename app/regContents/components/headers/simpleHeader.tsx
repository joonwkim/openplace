'use client';
import Image from 'next/image';
import React, { useCallback, useEffect, forwardRef, useState, useImperativeHandle, useRef } from 'react';
import { Col, Form, Row, Badge } from 'react-bootstrap';
import styles from '@/app/regContents/page.module.css';
import { DropzoneOptions } from 'react-dropzone';
import { useSession, } from 'next-auth/react';
import ImgUploader from '@/components/controls/imgUploader';
import { getFormdata } from '@/app/regContents/lib/formData';
import { consoleLogFormData } from '@/app/lib/formdata';

type RegProjectKnowhowProps = {

    setRegDataToSave: (data: any) => void,
    // thumbnailCloudinaryData: CloudinaryData,
    knowhow: any | undefined,
};

export const SimpleHeader = forwardRef<any, RegProjectKnowhowProps>((props: RegProjectKnowhowProps, ref) => {
    const { setRegDataToSave, knowhow } = props;
    const [otherFormData, setOtherFormData] = useState<any>(null);
    const [thumbNailFormData, setThumbNailFormData] = useState<any>(null);
    const { data: session } = useSession();
    const formRef = useRef<any>();
    const [validated, setValidated] = useState(false);
    const [thumbnailSecureUrl, setThumbnailSecureUrl] = useState('');
    const [file, setFile] = useState<any>();
    const [canDisable, setCanDisable] = useState(true)
    const [imgSrc, setImgSrc] = useState('');

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                handleSubmit(formRef.current);
                // console.log('canDisable in useImperativeHandle', canDisable)
                setRegDataToSave({ otherFormData, thumbNailFormData, canDisable });
            }
        }),
    );

    const onDrop = useCallback(async (files: File[]) => {
        setFile(Object.assign(files[0], { secure_url: URL.createObjectURL(files[0]) }));

    }, []);


    const options: DropzoneOptions = {
        accept: { 'image/*': [] }, maxSize: 1024 * 1000, maxFiles: 1, onDrop
    };

    const handleSubmit = async (form: any) => {
        try {

            if (!file && !thumbnailSecureUrl) {
                // alert('썸네일 이미지를 등록하세요');
                // setValidDataEntered(false)
                setCanDisable(true)
                // console.log('canDisable', canDisable)
                // return;
            }
            else {
                setCanDisable(false)
                // console.log('canDisable', canDisable)
            }
            if (form.checkValidity() === false) {
                setCanDisable(true)
                // console.log('canDisable', canDisable)
            }
            else {
                setCanDisable(false)
                // console.log('canDisable', canDisable)
            }
            setValidated(true);
            // console.log('authorId:', session?.user.id)

            if (file) {
                const formData = new FormData(form);
                formData.append('isGroupType', 'true')
                formData.append('file', file);
                formData.append('authorId', session?.user.id);
                formData.set('thumbNailImage', imgSrc);
                setOtherFormData(formData);
                consoleLogFormData('form data', formData)
                const td = await getFormdata(file, 'openplace');
                td.append('path', file.path);
                setThumbNailFormData(td);
            }

        } catch (error) {
            console.log('handleSubmit in simpleHeader error: ', error);
        }

    };

    return (
        <>
            <Form ref={formRef} noValidate validated={validated} onSubmit={handleSubmit}>
                <div className='d-flex mt-3 gap-2'>
                    <div className="card shadow p-3 mb-5 col-4" tabIndex={0}>
                        {thumbnailSecureUrl ? (<div className='col-5 p-3'>
                            <Image alt={thumbnailSecureUrl} src={thumbnailSecureUrl} quality={100} fill sizes="100vw" style={{
                                objectFit: 'contain',
                            }}
                            />
                        </div>) : (<>{file ? (
                            <div className='col-5 p-3'>
                                <Image
                                    alt={file.name}
                                    src={file.secure_url}
                                    quality={100}
                                    fill
                                    sizes="100vw"
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                        ) : (<div>
                            <h3 className='text-center mt-3 mb-2'>  썸네일 이미지 등록 <b className={styles.redColor}>*</b></h3>
                            <div className='input-drop-project'>
                                <ImgUploader loaderMessage='썸네일 이미지를 끌어오거나 선택하세요 ' dropMessage='Drag &amp; drop files here, or click to select files' options={options} showUploadIcon={true} />
                            </div>
                        </div>)}</>)}
                    </div>
                    <div className="card shadow p-3 mb-5 col-7">
                        <Form.Group controlId="title" className='mb-3'>
                            <Row>
                                <Form.Label column="lg" lg={3}>
                                    제목 <b className={styles.redColor}>*</b>
                                </Form.Label>
                                <Col>
                                    <Form.Control size="lg" type="text" required placeholder="제목을 입력하세요" name='title' defaultValue={knowhow?.title} />
                                    <Form.Control.Feedback type="invalid">
                                        제목을 입력하세요
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="description" className='mb-3'>
                            <Row>
                                <Form.Label column="lg" lg={3}>
                                    설명:
                                </Form.Label>
                                <Col>
                                    <Form.Control required name='description'
                                        as="textarea"
                                        placeholder="자세한 설명을 입력하세요"
                                        style={{ height: '150px' }}
                                        defaultValue=' ' />
                                    <Form.Control.Feedback type="invalid" >
                                        자세한 설명을 입력하세요
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>
                    </div>
                </div>
            </Form>
        </>
    )
});

SimpleHeader.displayName = "SimpleHeader"