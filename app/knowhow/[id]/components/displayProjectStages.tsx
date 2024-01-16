'use client';
import React, { useEffect, useRef, useState } from 'react'
import './scroll.css';
import DispSelfContents from './displaySelfContents';
import { Stage } from '@/app/lib/types';

type GenProps = {
    // stages: Stage[],
};

const DisplayProjectStages = (props: GenProps) => {
    // const { stages } = props;
    const wrapperContainerRef = useRef<HTMLDivElement>(null)
    const stageScrollContainerRef = useRef<HTMLDivElement>(null);
    const [leftStage, setLeftStage] = useState<number>(0);
    const [rightStage, setRightStage] = useState<number>(0);
    const [stageTitle, setStageTitle] = useState('')
    const [stages, setStages] = useState<Stage[]>([])

    // useEffect(() => {
    //     setStages(props.stages)
    // }, [props.stages])


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

    const scrollToRight = () => {
        const wraperContainer = wrapperContainerRef.current;
        const scrollContainer = stageScrollContainerRef.current;
        if (scrollContainer && wraperContainer) {
            setLeftStage(scrollContainer.scrollLeft - wraperContainer.scrollWidth)
            setRightStage(scrollContainer.scrollWidth - (scrollContainer.scrollLeft + wraperContainer.scrollWidth))
        }
    }

    const handleAddStage = () => {
        // alert('handleSaveProjectStage clicked')
        console.log('handle Add Stage')
        setStageTitle('')
        let stage: Stage = {
            stageTitle: stageTitle,
            stage: stages.length,
            // levelInStage: 0,
        }
        setStages(prev => [...prev, stage])
        stages.push(stage);
    }

    const handleRegisterStage = (stageNumber: number) => {
        alert('handleRegisterStage')
        //여기에서 modal에서 입력된 Data를 가지고 stage를 생성해줘야 함
        // const stgs = stages.filter(s => s.stage === stageNumber);
        // // alert(JSON.stringify(stgs, null, 2))
        // if (stgs?.length > 0) {
        //     const stg: Stage = {
        //         stageTitle: '새로운 아이템',
        //         stage: stgs[0].stage,
        //         levelInStage: stgs.length + 1,
        //         thumbnailUrl: stgs[0].thumbnailUrl,
        //     }
        //     stages[stageNumber].stages?.push(stg)
        //     // scrollToRight();
        //     // window.location.reload();
        // } else {

        // }

    }
    return (

        <>

            {/* {JSON.stringify(stages, null, 2)} */}
            <div className='scroll-wrapper mt-3' ref={wrapperContainerRef}>
                {/* button on the left */}

                {stages.length > 0 && <button type='button' className='btn btn-outline-light border rounded-circle scroll-button left' onClick={() => handleStageItemsScrollContent('left')} title='Move Left'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                    </svg>
                </button>}

                <div className='scroll-container' ref={stageScrollContainerRef}>
                    {stages?.length > 0 && stages.map((stage, index) => (
                        <div key={index} className='btn mx-2'>
                            <DispSelfContents stage={stage} onClick={() => handleRegisterStage(stage.stage)} />
                        </div>
                    ))}
                    <div className='mt-4' data-bs-toggle="modal" data-bs-target="#staticBackdropForAddStageTitle">
                        <button className='btn btn-primary p-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16" >
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                        </svg>단계 생성하기</button>
                    </div>
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
                            {/* <button type="submit" form="profileChangeForm" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSaveProjectStage} disabled={!stageTitle}>생성</button> */}
                            <button type="submit" form="profileChangeForm" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAddStage}>생성</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DisplayProjectStages