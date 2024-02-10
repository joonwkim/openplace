'use client';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './multiItemsCarousel.css';
import { Stage, StageContents, ChildDetail, } from '@/app/lib/types';
import { DropzoneOptions } from 'react-dropzone';
import Image from 'next/image';
import StageTitle from '@/app/regContents/components/stages/stageTitle';
import ArrowDown from '@/app/regContents/components/stages/arrowDown';
import ChildThumbnail from './childThumbnail';
import new_logo_cross from '@/public/svgs/new_logo_cross.svg'
import { useSession } from 'next-auth/react';
import { getFormdata } from '../../lib/formData';
import StageContextMenu from './stageContextMenu';
import RegiStageContentsModal from './regiStageContentsModal';
import StageContentsModal from './stageContentsModal';

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
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [stages, setStages] = useState<Stage[]>([])
    const [thumbnail, setThumbnail] = useState('')
    const [selectedStage, setSelectedStage] = useState<Stage | undefined | null>()
    const [selectedStageContents, setSelectedStageContents] = useState<StageContents | undefined | null>()
    const [file, setFile] = useState<any>();
    const { data: session } = useSession();
    const [showStageContentsModal, setShowStageContentsModal] = useState(false);

    const getChildDetail = (childDetail: any) => {
        let ch: ChildDetail = {

        }
        return ch;
    }

    const createAddStageContentsBtn = useCallback((stg: Stage | undefined) => {
        if (stg) {
            let sc: StageContents = {
                title: 'new',
                authorId: session?.user.id,
                description: '',
                thumbnailUrl: '',
                isDeleted: false,
            }
            if (!stg.stageContents) {
                stg.stageContents = [];
            }
            stg.stageContents.push(sc);
        }
    }, [session?.user.id])

    const getInitialStages = useCallback((knowhow: any) => {
        let stgs: Stage[] = []
        if (knowhow?.stages.length > 0) {
            knowhow?.stages.forEach((s: any, index: number) => {
                let childStg: StageContents[] = [];
                if (s.stageContents.length > 0) {
                    s.stageContents.forEach((c: any, ci: number) => {
                        const stageContents: StageContents = {
                            id: c.id,
                            title: c.title,
                            description: c.description,
                            authorId: knowhow.author.id,
                            thumbnailUrl: c.thumbnailCloudinaryData?.secure_url,
                            childDetail: getChildDetail(c),
                            isDeleted: false,
                        }
                        childStg.push(stageContents);
                    })
                }
                const stg: Stage = {
                    id: s.id,
                    stageTitle: s.stageTitle,
                    stage: s.stage,
                    stageContents: childStg,
                }
                if (editMode) {
                    createAddStageContentsBtn(stg)
                }
                stgs.push(stg)
            });
        }
        return stgs;

    }, [createAddStageContentsBtn, editMode])


    useEffect(() => {
        const stgs = getInitialStages(knowhow)
        // console.log('initial stages[0]:', JSON.stringify(stgs[0], null, 2))
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
                stageContents: []
            }
            stages.push(stg);
        } else {
            stg = {
                stageTitle: stageTitle,
                stage: 0,
                stageContents: []
            }
            setStages(prev => [...prev, stg])
        }
        return stg;
    }

    const getStageContensDetails = () => {

    }

    const removeAddStageContentsBtn = (stg: Stage | undefined) => {

    }

    const handleAddStage = () => {
        setStageTitle('')

        let stg: Stage;
        stg = createRootStageChild();
        createAddStageContentsBtn(stg);
    }

    const handleMouseOut = () => {
        stageContentsRef.current?.handleSubmit();
    }

    const handlAddStageContentsBtnClick = (stage: Stage | undefined | null, stageContents: StageContents | undefined | null) => {
        setSelectedStage(stage);
        setSelectedStageContents(stageContents)
        if (stage) {
            createAddStageContentsBtn(stage)
        }
        setShowStageContentsModal(true)
        setThumbnail('')
    }
    const handleCreateStageContentsBtnClick = async (stageContents: StageContents | undefined | null) => {
        console.log('handleCreateStageContentsBtnClick: ', handleCreateStageContentsBtnClick)
        if (stageContents) {
            stageContents.thumbnailUrl = thumbnail;
            setThumbnail('')
        }
        setShowStageContentsModal(false)
        setShowContextMenu(false);
    }

    const handleFormAction = async (formData: FormData) => {
        try {
            if (selectedStageContents) {
                const title = formData.get('title') as string;
                const description = formData.get('description') as string;
                selectedStageContents.title = title;
                selectedStageContents.description = description;
                selectedStageContents.authorId = session?.user.id;

                if (file) {
                    const td = await getFormdata(file, 'openplace');
                    td.append('path', file.path);
                    selectedStageContents.thumbnailFormdata = td;
                }
                setStages(stages)
            }
            setSelectedStage(null)
            setSelectedStageContents(null)
        } catch (error) {
            console.log('handleSubmit in regiGeneral error: ', error);
        }
    }

    const handleCancelBtnClicked = () => {
        setSelectedStage(null)
        setSelectedStageContents(null)
        setShowStageContentsModal(false)
        setShowContextMenu(false);
    }

    const handleShowStageContents = (stageContents: StageContents) => {
        alert('handleShowContents clicked: ' + stageContents.thumbnailUrl)
    }

    const handleContextMenu = (e: any, stage: Stage, contents: StageContents) => {
        e.preventDefault()
        setShowContextMenu(true)
        setSelectedStage(stage)
        setSelectedStageContents(contents);
        const { pageX, pageY } = e
        document.documentElement.style.setProperty('--context-menu-top', `${pageY - 950}px`)
        document.documentElement.style.setProperty('--context-menu-left', `${pageX - 110}px`)
    }

    const handleEditContextMenuBtnClicked = () => {
        if (selectedStageContents) {

            console.log('selectedStageContents: ', selectedStageContents)
            if (selectedStageContents.thumbnailUrl) {
                // thumbnail = selectedStageContents.thumbnailUrl;
                setThumbnail(selectedStageContents.thumbnailUrl)
            }

            setShowStageContentsModal(true);
            // setShowContextMenu(false);
            // setSelectedStage(null)
            // setSelectedStageContents(null);

        }
        else {
            setShowContextMenu(false);
        }
    }

    const handleDeleteContextMenuBtnClicked = () => {
        if (selectedStageContents) {
            selectedStageContents.isDeleted = true;
            setShowContextMenu(false);
            setSelectedStage(null)
            setSelectedStageContents(null);
        }
        else {
            setShowContextMenu(false);
        }
    }

    const handleClose = () => setShowStageContentsModal(false);
    const handleShow = () => setShowStageContentsModal(true);

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
                        <div key={stageIndex} className='btn mx-2' onClick={() => setSelectedStage(stage)} onMouseOut={handleMouseOut}>
                            {stage && <div className='mt-3 mx-2' onMouseOut={handleMouseOut}>
                                <StageTitle title={stage.stageTitle} />
                                <ArrowDown />
                                {showContextMenu && <StageContextMenu editStageContent={handleEditContextMenuBtnClicked} deleteStageContent={handleDeleteContextMenuBtnClicked} />}
                                {stage.stageContents && stage.stageContents?.length > 0 && (<>
                                    {stage.stageContents.map((stageContents: StageContents, scIndex: number) => (<>
                                        <div key={scIndex}>
                                            {editMode ? (stageContents.isDeleted ? (<>
                                            </>) :
                                                (<>
                                                    {stageContents.thumbnailUrl ? <ChildThumbnail key={scIndex} title={stageContents.title} src={stageContents.thumbnailUrl} onClick={() => handleShowStageContents(stageContents)} onContextMenu={(e) => handleContextMenu(e, stage, stageContents)} /> :
                                                        <div className='cross-container mt-2' onClick={() => { handlAddStageContentsBtnClick(stage, stageContents) }} >
                                                            <div className='cross-btn mt-5'>
                                                                <Image priority src={new_logo_cross} height={100} width={100} alt="cross" />
                                                            </div>
                                                            <div className='add-stage-btn text-center'>컨텐츠 등록하기</div>

                                                        </div>}
                                                </>)) : (<>
                                                    {stageContents.thumbnailUrl ? <ChildThumbnail key={scIndex} title={stageContents.title} src={stageContents.thumbnailUrl} onClick={() => handleShowStageContents(stageContents)} /> :
                                                        <div className='cross-container mt-2' onClick={() => { handlAddStageContentsBtnClick(stage, stageContents) }} >
                                                            <div className='cross-btn mt-5'>
                                                                <Image priority src={new_logo_cross} height={100} width={100} alt="cross" />
                                                            </div>
                                                            <div className='add-stage-btn text-center'>컨텐츠 등록하기</div>
                                                        </div>}
                                            </>)}
                                        </div>
                                        {/* stage contents 등록 모달 */}
                                        {/* <RegiStageContentsModal modalId={`staticBackdropForStageContents${stageIndex}${scIndex}`} formId={`createChildForm${stageIndex}${scIndex}`} stageContents={stageContents} childHeaderFormRef={childHeaderFormRef}
                                            childDetailsRef={childDetailsRef} getStageContensDetails={getStageContensDetails} handleAction={handleFormAction} handleCreateStageContents={() => handleCreateStageContentsBtnClick(stageContents)}
                                            options={options} onDrop={onDrop} thumbnail={thumbnail} handleCancelBtnClicked={handleCancelBtnClicked}
                                        /> */}
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
            <StageContentsModal show={showStageContentsModal} handleClose={handleClose} stageContents={selectedStageContents}
                childDetailsRef={childDetailsRef} getStageContensDetails={getStageContensDetails} handleAction={handleFormAction} handleCreateStageContents={() => handleCreateStageContentsBtnClick(selectedStageContents)}
                options={options} onDrop={onDrop} thumbnail={thumbnail} handleCancelBtnClicked={handleCancelBtnClicked}
            />
        </>
    )
});

ProjectStages.displayName = "ProjectStages"