'use client';
import Image from 'next/image';
import React, { useCallback, forwardRef, useState, useImperativeHandle, useRef } from 'react';
import { Col, Form, Row, } from 'react-bootstrap';
import styles from '@/app/regContents/page.module.css';
import { DropzoneOptions } from 'react-dropzone';
import ImgUploader from '@/components/controls/imgUploader';
import './multiItemsCarousel.css';
import { getFormdata } from '@/app/regContents/lib/formData';
import { Stage, StageProjectHeaderData } from '@/app/lib/types';
import { getSecureUrl } from '@/app/lib/formdata';
import { useSession } from 'next-auth/react';
// import { consoleLogFormData, getSecureUrl } from '@/app/lib/formdata';
// import { readFile } from 'fs';

type RegProjectKnowhowProps = {
    stage: Stage,
    setRegDataToSave: (data: any) => void,
    // header?: StageProjectHeaderData | undefined,
    // thumbnailCloudinaryData: CloudinaryData,
    // knowhow: any | undefined,
};

export const RegiStageProjectHeader = forwardRef<any, RegProjectKnowhowProps>((props: RegProjectKnowhowProps, ref) => {
    const { stage, setRegDataToSave } = props;
    const formRef = useRef<any>();
    const [validated, setValidated] = useState(false);
    const [thumbnailSecureUrl, setThumbnailSecureUrl] = useState('');
    const [file, setFile] = useState<any>();
    const { data: session } = useSession();
    // const [imgSrc, setImgSrc] = useState('');
    const [stageProjectHeaderData, setStageProjectHeaderData] = useState<StageProjectHeaderData>()

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                handleSubmit(formRef.current);

                setRegDataToSave({ stageProjectHeaderData });
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
            if (file) {
                const formData = new FormData(form);
                const description = formData.get('description') as string;
                const td = await getFormdata(file, 'openplace');
                td.append('path', file.path);
                const header: StageProjectHeaderData = {
                    stageTitle: props.stage.stageTitle,
                    description: description,
                    thumbnailFormdata: td,
                    thumbnailUrl: getSecureUrl(td),
                    stage: stage.stage,
                    authorId: session?.user.id,
                    // levelInStage: stage.levelInStage
                }
                console.log('header created:', header)
                console.log('stage in header', stage)
                setStageProjectHeaderData(header)
                if (description) {
                    const header: StageProjectHeaderData = {
                        stageTitle: props.stage.stageTitle,
                        description: description,
                        thumbnailFormdata: td,
                        thumbnailUrl: getSecureUrl(td),
                        stage: stage.stage,
                        authorId: session?.user.id,
                        // levelInStage: stage
                    }
                    setStageProjectHeaderData(header)
                }
            }
        } catch (error) {
            console.log('handleSubmit in regiGeneral error: ', error);
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

RegiStageProjectHeader.displayName = "RegiStageProjectHeader"