'use client';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './multiItemsCarousel.css';
import { Stage, ChildContents, ChildDetail, } from '@/app/lib/types';
import ImgUploader from '@/components/controls/imgUploader';
import { Col, Form, Row, } from 'react-bootstrap';
import { DropzoneOptions } from 'react-dropzone';
import Image from 'next/image';
import StageTitle from '@/app/regContents/components/stages/stageTitle';
import ArrowDown from '@/app/regContents/components/stages/arrowDown';
import ChildThumbnail from './childThumbnail';
import new_logo_cross from '@/public/svgs/new_logo_cross.svg'
import { useSession } from 'next-auth/react';
import { getFormdata } from '../../lib/formData';
import { RegiOtherDatails } from '../regiOtherDetails';
// import { title } from 'process';
// import { useRouter } from 'next/navigation';

type ProjectStageProps = {
    setRegDataToSave: (data: any) => void,
    rootThumbnailUrl: string,
    knowhow: any | undefined,
    editMode: boolean | undefined,
    // isGroupType: boolean | undefined
    // stages: Stage[],
};

export const ProjectStages = forwardRef<any, ProjectStageProps>(({ setRegDataToSave, rootThumbnailUrl, knowhow, editMode, }: ProjectStageProps, ref) => {
    const stageContentsRef = useRef<any>(null);
    const childDetailsRef = useRef<any>(null)
    const wrapperContainerRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const childHeaderFormRef = useRef<any>();
    const [leftStage, setLeftStage] = useState<number>(0);
    const [rightStage, setRightStage] = useState<number>(0);
    const [stageTitle, setStageTitle] = useState('')


    const [stages, setStages] = useState<Stage[]>([])
    const [currentStage, setCurrentStage] = useState(0)
    const [thumbnail, setThumbnail] = useState('')
    // const [validated, setValidated] = useState(false);
    // const [childTitle, setChildTitle] = useState('')
    // const [childDesc, setChildDesc] = useState('')
    // const [childFormData, setChildFormData] = useState<FormData>();
    const [file, setFile] = useState<any>();
    const [currentChild, setCurrentChild] = useState<ChildContents>()
    // const addChildBtnRef = useRef<any>(null);
    const { data: session } = useSession();
    // const router = useRouter();

    const getChildDetail = (childDetail: any) => {
        let ch: ChildDetail = {

        }
        return ch;
    }

    const getInitialStages = useCallback((knowhow: any) => {
        // console.log('useCallback knowhow.stages:', knowhow.stages.length)
        let stgs: Stage[] = []
        if (knowhow?.stages.length > 0) {
            knowhow?.stages.forEach((s: any, index: number) => {
                // console.log('useCallback knowhow.stage:', s)
                let childStg: ChildContents[] = [];
                if (s.ChildContentss.length > 0) {
                    s.ChildContentss.forEach((c: any, ci: number) => {
                        // console.log('useCallback ChildContents:', c)
                        const child: ChildContents = {
                            id: c.id,
                            title: c.title,
                            description: c.description,
                            authorId: knowhow.author.id,
                            thumbnailUrl: c.thumbnailCloudinaryData?.secure_url,
                            childDetail: getChildDetail(c),
                        }
                        childStg.push(child);
                    })
                }
                const stg: Stage = {
                    id: s.id,
                    stageTitle: s.stageTitle,
                    stage: s.stage,
                    childContents: childStg,
                }
                if (editMode) {
                    let child: ChildContents = {
                        title: 'new',
                        authorId: session?.user.id,
                        description: '',
                        thumbnailUrl: '',
                    }
                    stg.childContents.push(child);
                }
                stgs.push(stg)
            });
        }
        // console.log('initial stages: ', JSON.stringify(stgs, null, 2))
        return stgs;

    }, [editMode, session?.user.id])


    useEffect(() => {
        const stgs = getInitialStages(knowhow)
        setStages(stgs)
    }, [getInitialStages, knowhow])

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                setRegDataToSave(stages)
            }
        }),
    );
    const onDrop = useCallback(async (files: File[]) => {
        try {
            setFile(null)
            setFile(Object.assign(files[0], { secure_url: URL.createObjectURL(files[0]) }));
            setThumbnail(URL.createObjectURL(files[0]))
        } catch (error) {

        }
    }, []);

    const options: DropzoneOptions = {
        accept: { 'image/*': [] }, maxSize: 1024 * 1000, maxFiles: 1, onDrop
    };

    const handleStageItemsScrollContent = (direction: 'left' | 'right') => {
        const wraperContainer = wrapperContainerRef.current;
        const scrollContainer = scrollContainerRef.current;

        const scrollAmount = direction === 'left' ? -300 : 300; // 스크롤할 양을 조정
        if (scrollContainer && wraperContainer) {
            scrollContainer.scrollLeft += scrollAmount;
            setLeftStage(prev => prev += scrollAmount);
            setRightStage(scrollContainer.scrollWidth - (scrollContainer.scrollLeft + wraperContainer.scrollWidth))
        }
    };

    const createRootStageChild = () => {
        let stg: Stage;
        if (editMode) {
            stg = {
                stageTitle: stageTitle,
                stage: 0,
                childContents: []
            }
            stages.push(stg);
        } else {
            stg = {
                stageTitle: stageTitle,
                stage: 0,
                childContents: []
            }
            setStages(prev => [...prev, stg])
        }
        return stg;
    }

    const getChildDetails = () => {

    }

    const createAddChildContentsBtn = (stg: Stage | undefined) => {
        if (stg) {
            let child: ChildContents = {
                title: 'new',
                authorId: session?.user.id,
                description: '',
                thumbnailUrl: '',
            }
            stg.childContents.push(child);
        }
    }

    const handleAddStage = () => {
        setStageTitle('')

        let stg: Stage;
        stg = createRootStageChild();
        createAddChildContentsBtn(stg);
    }

    const handleMouseOut = () => {
        stageContentsRef.current?.handleSubmit();
    }

    const handleCreateChildContents = async (child: ChildContents) => {
        child.thumbnailUrl = thumbnail;
        setCurrentChild(child);
        setThumbnail('')
    }

    const handleShowContents = (child: ChildContents) => {
        // alert('handleShowContents clicked')
    }

    const handlAddChildContents = (stage: Stage) => {
        createAddChildContentsBtn(stage)
        setThumbnail('')
    }

    const handleAction = async (formData: FormData) => {
        try {
            if (file) {
                const title = formData.get('title') as string;
                const description = formData.get('description') as string;
                const td = await getFormdata(file, 'openplace');
                td.append('path', file.path);
                if (currentChild) {
                    currentChild.title = title;
                    currentChild.description = description;
                    currentChild.authorId = session?.user.id;
                    currentChild.thumbnailFormdata = td;
                }
            }
        } catch (error) {
            console.log('handleSubmit in regiGeneral error: ', error);
        }
    }

    return (
        <>
            <div className='scroll-wrapper mt-3' ref={wrapperContainerRef}>
                {stages.length > 0 && <button type='button' className='btn btn-outline-light border rounded-circle scroll-button left' onClick={() => handleStageItemsScrollContent('left')} title='Move Left'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                    </svg>
                </button>}
                <div className='scroll-container' ref={scrollContainerRef}>
                    {stages?.length > 0 && stages.map((stage: Stage, stageIndex: number) => (<>
                        <div key={stageIndex} className='btn mx-2' onClick={() => setCurrentStage(stageIndex)} onMouseOut={handleMouseOut}>
                            {stage && <div className='mt-3 mx-2' onMouseOut={handleMouseOut}>
                                <StageTitle title={stage.stageTitle} />
                                <ArrowDown />
                                {stage.childContents && stage.childContents?.length > 0 && (<>
                                    {stage.childContents.map((child: ChildContents, childIndex: number) => (<>
                                        <div key={childIndex}>
                                            {child.thumbnailUrl ? <ChildThumbnail key={childIndex} title={child.title} src={child.thumbnailUrl} onClick={() => handleShowContents(child)} /> :
                                                <div className='cross-container mt-2' onClick={() => handlAddChildContents(stage)} data-bs-toggle="modal" data-bs-target={`#staticBackdropForChild${stageIndex}${childIndex}`}>
                                                    <div className='cross-btn mt-5'>
                                                        <Image priority src={new_logo_cross} height={100} width={100} alt="cross" />
                                                    </div>
                                                    <div className='add-stage-btn text-center'>컨텐츠 등록하기</div>
                                                </div>}
                                        </div>
                                        <div className="modal modal-xl fade" id={`staticBackdropForChild${stageIndex}${childIndex}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropForAddKnowhowProjectLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h3 className="modal-title" id="staticBackdropForAddKnowhowProjectLabel">단계별 프로젝트</h3>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className='row text-center'>
                                                        </div>
                                                        <Form id={`createChildForm${stageIndex}${childIndex}`} ref={childHeaderFormRef} action={handleAction}>
                                                            <div className='d-flex mt-3 gap-2'>
                                                                <div className="card shadow p-3 mb-5 col-4" tabIndex={0}>
                                                                    {thumbnail ? (
                                                                        <div className='col-5 p-3'>
                                                                            <Image alt={thumbnail} src={thumbnail} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} />
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
                                                        <RegiOtherDatails ref={childDetailsRef} setRegDataToSave={getChildDetails} />
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="submit" className="btn btn-primary" form={`createChildForm${stageIndex}${childIndex}`} data-bs-dismiss="modal" onClick={() => handleCreateChildContents(child)}>컨텐츠 생성</button>
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    ))}
                                </>)}

                            </div>}
                        </div>
                    </>
                    ))}
                    {editMode && <div className='mt-4' data-bs-toggle="modal" data-bs-target="#staticBackdropForAddStageTitle">
                        <button className='btn btn-primary p-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16"  >
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                            </svg>단계 생성하기</button>
                    </div>}

                </div>
                {stages.length > 0 && <button type='button' className='ms-3 btn btn-outline-light border rounded-circle scroll-button right' onClick={() => handleStageItemsScrollContent('right')} title='Move Right'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </button>}
            </div>
            {/* stage title 단계생성 모달 */}
            <div className="modal modal-lg fade" id="staticBackdropForAddStageTitle" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropForAddStageTitleLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title" id="staticBackdropForProfileChangeLabel">새단계</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex">
                            <div className='col-1'>제목:</div>
                            <div className='col-11'>
                                <input id='stageTitleInput' type="text" className="form-control" value={stageTitle} onChange={(e) => setStageTitle(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAddStage}>단계 생성</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )
});

ProjectStages.displayName = "ProjectStages"