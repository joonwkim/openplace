'use client';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './multiItemsCarousel.css';
import ImgUploader from '@/components/controls/imgUploader';
import { Col, Form, Row, } from 'react-bootstrap';
import Image from 'next/image';
import { RegiOtherDatails } from '../regiOtherDetails';
import { relative } from 'path';

type RegiStageContentsProps = {
    modalId: string,
    formId: string,
    child: any,
    childHeaderFormRef: any,
    childDetailsRef: any,
    getStageContensDetails: any,
    options: any,
    onDrop: any,
    thumbnail: string,
    handleAction: (formData: FormData) => void,
    handleCreateStageContents: (child: any) => void,
    handleCancelBtnClicked: () => void,
}

export const RegiStageContentsModal = ({ modalId, formId, child, childHeaderFormRef, childDetailsRef, getStageContensDetails, options, onDrop, thumbnail, handleAction, handleCreateStageContents, handleCancelBtnClicked }: RegiStageContentsProps) => {

    return (
        <div className="modal modal-xl fade" id={modalId} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropForAddKnowhowProjectLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title" id="staticBackdropForAddKnowhowProjectLabel">단계별 프로젝트</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className='row text-center'>
                        </div>
                        <Form id={formId} ref={childHeaderFormRef} action={handleAction}>
                            <div className='d-flex mt-3 gap-2'>
                                <div className="card shadow p-3 mb-5 col-4" tabIndex={0}>
                                    {thumbnail ? (
                                        <div className='col-5 p-3 relative'>
                                            <Image alt={thumbnail} src={thumbnail} quality={100} fill sizes="100vw" style={{ objectFit: 'none', }} />
                                        </div>
                                    ) : (<div>
                                        <h3 className='text-center mt-3 mb-2'>  썸네일 이미지 등록 <b className='danger'>*</b></h3>
                                        <div className='input-drop-project'>
                                            <ImgUploader loaderMessage='썸네일 이미지를 끌어오거나 선택하세요 ' dropMessage='Drag &amp; drop files here, or click to select files' options={options} showUploadIcon={true} />
                                        </div>
                                    </div>)}
                                </div>
                                <div className="card shadow p-3 mb-5 col-7">
                                    <Form.Group controlId="title" className='mb-3'>
                                        <Row>
                                            <Form.Label column="lg" lg={3}>
                                                제목 <b className='danger'>*</b>
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
                        <RegiOtherDatails ref={childDetailsRef} setRegDataToSave={getStageContensDetails} />
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary" form={formId} data-bs-dismiss="modal" onClick={() => handleCreateStageContents(child)}>컨텐츠 생성</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancelBtnClicked} >취소</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegiStageContentsModal