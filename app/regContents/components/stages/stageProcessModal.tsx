'use client'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row, } from 'react-bootstrap';
import ImgUploader from '@/components/controls/imgUploader';
import Image from 'next/image';
import { RegiOtherDatails } from '../regiOtherDetails';
import { useState } from 'react';
type StageProcessModalProps = {
    show: boolean | undefined;
    handleClose: any,
    handleCreateStagePorcess: () => void,
    handleStageProcessAction: (formData: FormData) => void,
    handleCancelBtnClicked: () => void,
};

const StageProcessModal = ({ show, handleClose, handleCreateStagePorcess, handleStageProcessAction, handleCancelBtnClicked }: StageProcessModalProps) => {
    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>새단계</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id='stageProcessTitleForm' action={handleStageProcessAction}>
                        <Form.Group controlId="stageTitle" className='mb-3'>
                            <Row>
                                <Form.Label column="lg" lg={3}>
                                    제목 <b className='danger'>*</b>
                                </Form.Label>
                                <Col>
                                    <Form.Control size="lg" type="text" required placeholder="단계의 제목을 입력하세요" name='stageTitle' />
                                    <Form.Control.Feedback type="invalid">
                                        제목을 입력하세요
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="submit" className="btn btn-primary" form='stageProcessTitleForm' onClick={handleCreateStagePorcess}>단계 생성</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelBtnClicked} >취소</button>
                </Modal.Footer>
            </Modal>
        </>)
}
export default StageProcessModal