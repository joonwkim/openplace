'use client'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row, } from 'react-bootstrap';
import ImgUploader from '@/components/controls/imgUploader';
import Image from 'next/image';
import { RegiOtherDatails } from '../regiOtherDetails';
type BoardModalProps = {
    show: boolean | undefined;
    stageContents: any,
    options: any,
    onDrop: any,
    thumbnail: string,
    handleClose: any,
    childDetailsRef: any,
    getStageContensDetails: any,
    handleStageContentsAction: (formData: FormData) => void,
    handleCreateStageContents: (stageContents: any) => void,
    handleCancelBtnClicked: () => void,
};

const StageContentsModal = ({ show, handleClose, stageContents, options, thumbnail, childDetailsRef, getStageContensDetails, handleStageContentsAction, handleCreateStageContents, handleCancelBtnClicked }: BoardModalProps) => {
    const handleSubmit = (e: any) => {
        handleCreateStageContents(e)
    }
    const handleAction = (formData: FormData) => {
        handleStageContentsAction(formData)
    }
    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>단계별 프로젝트</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Form id='stageContentsForm' action={handleAction} onSubmit={handleSubmit}>
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
                                                {stageContents?.title !== 'new' ? (<> <Form.Control size="lg" type="text" required placeholder="제목을 입력하세요" name='title' defaultValue={stageContents?.title} /></>) :
                                                    (<> <Form.Control size="lg" type="text" required placeholder="제목을 입력하세요" name='title' /></>)
                                                }
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
                                                    defaultValue={stageContents?.description} />
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
                </Modal.Body>
                <Modal.Footer>
                    <button type="submit" className="btn btn-primary" form='stageContentsForm'>{stageContents?.title !== "new" ? (<div>컨텐츠 수정</div>) : (<div>컨텐츠 생성</div>)}</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelBtnClicked} >취소</button>
                </Modal.Footer>
            </Modal>
        </>)
}
export default StageContentsModal