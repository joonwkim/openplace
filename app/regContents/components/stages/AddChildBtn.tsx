'use client';
import Image from 'next/image';
import { Card, } from 'react-bootstrap';
import './multiItemsCarousel.css';
import new_logo_cross from '@/public/svgs/new_logo_cross.svg'
import { MouseEventHandler, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { any } from 'zod';
import { ChildDetail, ChildStage, Stage } from '@/app/lib/types';
import { ChildProject } from './childProject';
import { ChildHeaderPage } from './childHeaderPage';
import { RegiOtherDatails } from '../regiOtherDetails';
import { Col, Form, Row, } from 'react-bootstrap';
import ImgUploader from '@/components/controls/imgUploader';
import styles from '@/app/regContents/page.module.css';
import { getSecureUrl } from '@/app/lib/formdata';
import { getFormdata } from '../../lib/formData';
import { useSession } from 'next-auth/react';
import { DropzoneOptions } from 'react-dropzone';

type AddChildBtnProps = {
    stage: Stage,
    handleCreateChild: () => void,
    setRegDataToSave: (data: any) => void,
};

export const AddChildBtn = forwardRef<any, AddChildBtnProps>(({ stage, handleCreateChild, setRegDataToSave }: AddChildBtnProps, ref) => {
    const childProjectRef = useRef<any>(null)
    const childDetailsRef = useRef<any>(null)
    const [disableCreateBtn, setDisableCreateBtn] = useState(false)
    const [child, setChild] = useState<ChildStage>()
    const [childDetail, setChildDetail] = useState<ChildDetail>()
    const [currentStage, setCurrentStage] = useState<Stage>()
    const [file, setFile] = useState<any>();
    const childHeaderFormRef = useRef<any>();
    const [validated, setValidated] = useState(false);
    const { data: session } = useSession();
    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                if (child && childDetail) {
                    child.ChildDetail = childDetail;
                }
                setRegDataToSave(child);
                console.log('child ', JSON.stringify(child, null, 2))
            }
        }),
    );

    const onMouseLeaveFromModalContents = () => {
        childProjectRef.current?.handleSubmit()
    }

    const getChildDetails = (data: any) => {
        const { ytData, imgFormData, pdfFormData, text } = data;

        const detail: ChildDetail = {
            ytData: ytData,
            imgData: imgFormData,
            pdfData: pdfFormData,
            text: text,
        }
        console.log('detail:', detail)
        setChildDetail(detail);
        // setProjectStage(stage.stage)
    };
    const handlAddContents = () => {
        setFile(null)
        childHeaderFormRef.current?.reset();
        console.log('stage', JSON.stringify(stage, null, 2))
    }
    const hdl = async () => {
        console.log('hdl')
        console.log('currentStage in handlAddContents', JSON.stringify(currentStage, null, 2))

        const formData = new FormData(childHeaderFormRef.current);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const td = await getFormdata(file, 'openplace');
        td.append('path', file.path);

        const child: ChildStage = {
            title: title,
            description: description,
            thumbnailFormdata: td,
            thumbnailUrl: getSecureUrl(td),
            authorId: session?.user.id,
        }

        setChild(child)
        setFile(null);
        formData.set('title', '')
    }
    const onDrop = useCallback(async (files: File[]) => {
        setFile(Object.assign(files[0], { secure_url: URL.createObjectURL(files[0]) }));

    }, []);

    const options: DropzoneOptions = {
        accept: { 'image/*': [] }, maxSize: 1024 * 1000, maxFiles: 1, onDrop
    };

    const handleSubmit = async (form: any) => {
        try {
            alert('handleSubmit')
        } catch (error) {
            console.log('handleSubmit in regiGeneral error: ', error);
        }
    };

    return (<>
        {JSON.stringify(file, null, 2)}
        <div className='cross-container mt-2' onClick={handlAddContents} data-bs-toggle="modal" data-bs-target="#staticBackdropForAddKnowhowProject">
            <div className='cross-btn mt-5'>
                <Image priority src={new_logo_cross} height={100} width={100} alt="cross" />
            </div>
            <div className='add-stage-btn text-center'>컨텐츠 등록하기</div>
            {stage.stage}
        </div>
        <div className="modal modal-xl fade" id="staticBackdropForAddKnowhowProject" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropForAddKnowhowProjectLabel" aria-hidden="true">

            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title" id="staticBackdropForAddKnowhowProjectLabel">단계별 프로젝트</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" onMouseLeave={onMouseLeaveFromModalContents}>
                        <Form ref={childHeaderFormRef} noValidate validated={validated} onSubmit={handleSubmit}>
                            <h2>Test</h2>{JSON.stringify(file, null, 2)}
                            <div className='d-flex mt-3 gap-2'>
                                <div className="card shadow p-3 mb-5 col-4" tabIndex={0}>
                                    {file ? (
                                        <div className='col-5 p-3'>
                                            <Image alt={file.name} src={file.secure_url} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} />
                                        </div>
                                    ) : (<div>
                                        <h3 className='text-center mt-3 mb-2'>  썸네일 이미지 등록 <b className={styles.redColor}>*</b></h3>
                                        <div className='input-drop-project'>
                                            <ImgUploader loaderMessage='썸네일 이미지를 끌어오거나 선택하세요 ' dropMessage='Drag &amp; drop files here, or click to select files' options={options} showUploadIcon={true} />
                                        </div>
                                    </div>)}
                                </div>
                                <div className="card shadow p-3 mb-5 col-7">
                                    <Form.Group controlId="title" className='mb-3'>
                                        <Row>
                                            <Form.Label column="lg" lg={3}>
                                                제목 <b className={styles.redColor}>*</b>
                                            </Form.Label>
                                            <Col>
                                                <Form.Control size="lg" type="text" required placeholder="제목을 입력하세요" name='title' />
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
                                                    style={{ height: '80px' }}
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
                        <RegiOtherDatails ref={childDetailsRef} setRegDataToSave={getChildDetails} />

                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" onClick={hdl} disabled={disableCreateBtn}>생성</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                    </div>
                </div>
            </div>
        </div>
    </>

    )
});
AddChildBtn.displayName = "AddChildBtn"