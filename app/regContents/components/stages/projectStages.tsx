'use client';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './multiItemsCarousel.css';
import { Stage, ChildStage, ChildHeader, ChildDetail, ChildData } from '@/app/lib/types';
import { any } from 'zod';
import { EditMode, getThumbnails } from '@/app/lib/convert';
import { ChildContents, } from './childContents';

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
    const wrapperContainerRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [leftStage, setLeftStage] = useState<number>(0);
    const [rightStage, setRightStage] = useState<number>(0);
    const [stageTitle, setStageTitle] = useState('')
    const [stages, setStages] = useState<Stage[]>([])
    const [currentStage, setCurrentStage] = useState(0)
    // const [childThumbnail, setChildThumbnail] = useState('')
    // const [childHeader, setChildHeader] = useState<ChildHeader>()
    // const [childDetail, setChildDetail] = useState<ChildDetail>()
    const [data, setData] = useState<ChildData>()
    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                // setRegDataToSave(stages)
            }
        }),
    );

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
        // console.log('create root stage and root child', stages)
        if (editMode) {
            let stg: Stage = {
                stageTitle: stageTitle,
                stage: 0,
                children: []
            }
            stages.push(stg);
        } else {
            // console.log('create root stage and root child not edit mode', stages)
            let stg: Stage = {
                stageTitle: stageTitle,
                stage: 0,
                children: []
            }
            setStages(prev => [...prev, stg])
        }
    }
    const createAddContentsBtn = () => {
        let stage: Stage = {
            stageTitle: stageTitle,
            stage: stages.length,
            children: [],
        }
        stages.push(stage);
    }
    const handleAddStage = () => {
        setStageTitle('')

        if (stages.length === 0) {
            createRootStageChild();
        } else {
            createAddContentsBtn();
        }
    }
    function getValue<T, K extends keyof T>(data: T, key: K) {
        return data[key];
    }
    const getChildData = (data: ChildData) => {
        // console.log('data getChildData ProjectStages: ', JSON.stringify(data.header, null, 2))
        setData(data)

    }
    const handleMouseOut = () => {
        stageContentsRef.current?.handleSubmit();
    }
    const hcc = () => {
        // alert('hcc')
        // console.log('header:', data?.header)
        // const header = data?.header
        // if (header) {
        //     const child: ChildStage = {
        //         title: header.title,
        //         description: header.description,
        //         thumbnailUrl: header?.thumbnailUrl,
        //     }
        //     stages[currentStage].children.push(child)
        // }
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
                    {stages?.length > 0 && stages.map((s: Stage, index: number) => (
                        <div key={index} className='btn mx-2' onClick={() => setCurrentStage(index)} onMouseOut={handleMouseOut}>
                            <ChildContents ref={stageContentsRef} setRegDataToSave={getChildData} stage={s} editMode={editMode} handleCreateChild={hcc} />
                        </div>
                    ))}
                    <div className='mt-4' data-bs-toggle="modal" data-bs-target="#staticBackdropForAddStageTitle">
                        <button className='btn btn-primary p-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16"  >
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                            </svg>단계 생성하기</button>
                    </div>
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
                            <button type="submit" form="profileChangeForm" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAddStage}>생성</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
});
ProjectStages.displayName = "ProjectStages"