'use client';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './multiItemsCarousel.css';
import { Stage, ChildStage } from '@/app/lib/types';
import { RegiStageContents } from './regiStageContents';
import { any } from 'zod';
import { EditMode, getThumbnails } from '@/app/lib/convert';

type GenProps = {
    setRegDataToSave: (data: any) => void,
    rootThumbnailUrl: string,
    knowhow: any | undefined,
    editMode: boolean | undefined,
    // stages: Stage[],
};

export const RegiProjectStages = forwardRef<any, GenProps>((props: GenProps, ref) => {
    const regiStageContentsRef = useRef<any>(null);
    const wrapperContainerRef = useRef<HTMLDivElement>(null)
    const stageScrollContainerRef = useRef<HTMLDivElement>(null);
    const [leftStage, setLeftStage] = useState<number>(0);
    const [rightStage, setRightStage] = useState<number>(0);
    const [stageTitle, setStageTitle] = useState('')
    const [stages, setStages] = useState<Stage[]>([])
    const [currentStage, setCurrentStage] = useState(0)
    const [stageThumbnail, setStageThumbnail] = useState('')
    const [stageProjectHeaderData, setStageProjectHeaderData] = useState<any>()
    const [stageProjectDetailData, setStageProjectDetailData] = useState<any>()

    const createinitialStages = useCallback(() => {
        if (stages.length === 0) {
            let stg: Stage = {
                stageTitle: props.knowhow.children[0].title,
                stage: 0,
                thumbnailUrl: props.knowhow.thumbnailCloudinaryData.secure_url,
                children: []
            }
            let child: ChildStage = {
                thumbnailUrl: props.knowhow.thumbnailCloudinaryData.secure_url,
            }
            stg.children?.push(child)
            if (props.knowhow.children.length > 0) {
                props.knowhow.children.map((child: any) => {
                    const ch: ChildStage = {
                        thumbnailUrl: child.thumbnailCloudinaryData.secure_url,
                    }
                    stg.children.push(ch)
                })
            }
            stages.push(stg);
        }
    }, [props.knowhow, stages])

    useEffect(() => {

        createinitialStages();

    }, [createinitialStages])

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                // handleSubmit(formRef.current);
                // // console.log('canDisable in useImperativeHandle', canDisable)
                // props.setRegDataToSave({ stageProjectHeaderData, stageProjectDetailData });
                // props.setRegDataToSave({ stageProjectData });
                props.setRegDataToSave(stages)
            }
        }),
    );

    const handleStageItemsScrollContent = (direction: 'left' | 'right') => {
        const wraperContainer = wrapperContainerRef.current;
        const scrollContainer = stageScrollContainerRef.current;

        const scrollAmount = direction === 'left' ? -300 : 300; // 스크롤할 양을 조정
        if (scrollContainer && wraperContainer) {
            scrollContainer.scrollLeft += scrollAmount;
            setLeftStage(prev => prev += scrollAmount);
            setRightStage(scrollContainer.scrollWidth - (scrollContainer.scrollLeft + wraperContainer.scrollWidth))
        }

    };

    const createRootStageChild = () => {
        console.log('create root stage and root child', stages)
        if (props.editMode) {
            let stg: Stage = {
                stageTitle: stageTitle,
                stage: 0,
                thumbnailUrl: props.knowhow.thumbnailCloudinaryData.secure_url,
                children: []
            }
            let child: ChildStage = {
                thumbnailUrl: props.knowhow.thumbnailCloudinaryData.secure_url,
            }
            stg.children?.push(child)

            stages.push(stg);
        } else {
            if (props.rootThumbnailUrl) {
                let child: ChildStage = {
                    // stageTitle: stageTitle,
                    // stage: 0,
                    // levelInStage: 0,
                    // thumbnailUrl: props.rootThumbnailUrl,
                }
                // stage.stages = [];
                // stage.stages.push(stage);
                // stages.push(stage);
                // console.log('stage added: ', stage)
            } else {
                alert('썸네일을 등록하세요')
            }
        }


    }
    const createAddContentsBtn = () => {
        let stage: Stage = {
            stageTitle: stageTitle,
            stage: stages.length,
            // levelInStage: 0,
            children: [],
        }
        // console.log('stage created:', stage)
        stages.push(stage);
        // console.log('stage created:', stage)



    }
    const handleAddStage = () => {
        console.log('handle add stage')
        setStageTitle('')

        if (stages.length === 0) {
            createRootStageChild();
        } else {
            createAddContentsBtn();
        }
    }

    const CreateChildStage = () => {
        const child: ChildStage = {
            // stageTitle: stages[currentStage].stageTitle,
            // stage: stages[currentStage].stage,
            // levelInStage: (stages[currentStage].children !== null || stages[currentStage].children?.length !==undefined)  ? stages[currentStage].children?.length : 0,
            thumbnailUrl: stageThumbnail,
            // stages: []
        }
        // console.log('stg created: ', stg)
        return child;
    }
    const handleCreateChildStageProject = () => {
        // alert('handleCreateProject clicked and stage No.:' + currentStage)

        // console.log('stageProjectHeaderData', stageProjectHeaderData)
        // console.log('stages:', stages)
        // console.log('stages[currentStage].stages:', stages[currentStage].stages)

        if (stages[currentStage]) {
            // console.log('stages[currentStage]', stages[currentStage])
            let child = CreateChildStage();
            child.StageProject = {
                StageProjectHeaderData: stageProjectHeaderData,
                StageProjectDetailData: stageProjectDetailData,
            }
            stages[currentStage].children?.push(child)
            console.log('stage Project created check property values: ', child)
        } else {
            console.log('not stages[currentStage]', stages[currentStage])
        }
        console.log('stages:', stages)
    }

    const getStageProjectData = ({ stageProjectHeaderData, stageProjectDetailData }: { stageProjectHeaderData: any, stageProjectDetailData: any }) => {
        console.log('stageProjectHeaderData?.thumbnailUrl:', stageProjectHeaderData?.thumbnailUrl)
        setStageThumbnail(stageProjectHeaderData?.thumbnailUrl)
        setStageProjectHeaderData(stageProjectHeaderData)
        setStageProjectDetailData(stageProjectDetailData)

        // stages[currentStage].StageProject = {
        //     StageProjectHeaderData: stageProjectHeaderData,
        //     StageProjectDetailData: stageProjectDetailData,
        // }
        // console.log('stageProjectHeaderData', stageProjectHeaderData)
        // console.log('stages:', stages)
    }

    const handleMouseOut = () => {
        // console.log('handleMouseOut: ')
        regiStageContentsRef.current?.handleSubmit();
    }
    return (
        <>
            <div className='scroll-wrapper mt-3' ref={wrapperContainerRef}>
                {/* button on the left */}

                {stages.length > 0 && <button type='button' className='btn btn-outline-light border rounded-circle scroll-button left' onClick={() => handleStageItemsScrollContent('left')} title='Move Left'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                    </svg>
                </button>}
                <div className='scroll-container' ref={stageScrollContainerRef}>
                    {stages?.length > 0 && stages.map((stage, index) => (
                        <div key={index} className='btn mx-2' onClick={() => setCurrentStage(stage.stage)} onMouseOut={handleMouseOut}>
                            <RegiStageContents ref={regiStageContentsRef} setRegDataToSave={getStageProjectData} stage={stage} handleCreateProject={handleCreateChildStageProject} />
                        </div>
                    ))}
                    {props.editMode && <div className='mt-4' data-bs-toggle="modal" data-bs-target="#staticBackdropForAddStageTitle">
                        <button className='btn btn-primary p-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16"  >
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                            </svg>단계 생성하기</button>
                    </div>}

                </div>
                {/* button on the right */}
                {stages.length > 0 && <button type='button' className='ms-3 btn btn-outline-light border rounded-circle scroll-button right' onClick={() => handleStageItemsScrollContent('right')} title='Move Right'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </button>}
            </div>
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
RegiProjectStages.displayName = "RegiProjectStages"