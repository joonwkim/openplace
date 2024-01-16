'use client';
import Image from 'next/image';
import './multiItemsCarousel.css';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import StageTitle from '@/app/knowhow/[id]/components/stageTitle';
import ArrowDown from '@/app/knowhow/[id]/components/arrowDown';
import DisplayKnowhowThumnail from '@/app/knowhow/[id]/components/displayKnowhowThumnail';
import { ChildStage, Stage } from '@/app/lib/types';
import { AddContentsBtn } from './addContentsBtn';
type GenProps = {
    stage: Stage,
    handleCreateProject: () => void,
    setRegDataToSave: (data: any) => void,
};

export const RegiStageContents = forwardRef<any, GenProps>(({ stage, handleCreateProject, setRegDataToSave, }: GenProps, ref) => {
    const addContentsBtnRef = useRef<any>(null);
    // const [stageProjectData, setStageProjectData] = useState<any>()
    const [data, setData] = useState<any>()
    const [stageProjectHeaderData, setStageProjectHeaderData] = useState<any>()
    const [stageProjectDetailData, setStageProjectDetailData] = useState<any>()
    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {

                setRegDataToSave({ stageProjectHeaderData, stageProjectDetailData });
                // setRegDataToSave({ stageProjectData });
            }
        }),
    );

    const handleShowContents = () => {
        alert('handleShowContents clicked')
    }
    const getStageProjectData = ({ stageProjectHeaderData, stageProjectDetailData }: { stageProjectHeaderData: any, stageProjectDetailData: any }) => {
        setStageProjectHeaderData(stageProjectHeaderData)
        setStageProjectDetailData(stageProjectDetailData)
        // console.log('getStageProjectData', data)
        // setStageProjectData(data);
        // setData(data);
    }
    const handleMouseOut = () => {
        addContentsBtnRef.current?.handleSubmit();
    }
    return (
        <>
            {stage && <div className='mt-3 mx-2' onMouseOut={handleMouseOut}>
                <StageTitle title={stage.stageTitle} />
                <ArrowDown />
                {stage.children && stage.children?.length > 0 && (<>
                    {stage.children.map((child: ChildStage, index: number) => (<>
                        {child.thumbnailUrl && <DisplayKnowhowThumnail key={index} title={stage.stageTitle} src={child.thumbnailUrl} onClick={handleShowContents} />}
                        {/* <ArrowDown /> */}
                    </>))}
                </>)}
                <AddContentsBtn ref={addContentsBtnRef} stage={stage} setRegDataToSave={getStageProjectData} handleCreateProject={handleCreateProject} />
            </div>}
            {/* {stage && stage.thumbnailUrl ? (
                <>
                    <div className='mt-3 mx-2' onMouseOut={handleMouseOut}>
                        <StageTitle title={stage.stageTitle} />
                        <ArrowDown />
                        {stage.children && stage.children?.length > 0 && (<>
                            {stage.children.map((s: ChildStage, index: number) => (<>
                                {s.thumbnailUrl && <DisplayKnowhowThumnail key={index} title={stage.stageTitle} src={s.thumbnailUrl} onClick={handleShowContents} />}
                            </>))}
                        </>)}
                        <AddContentsBtn ref={addContentsBtnRef} stage={stage} setRegDataToSave={getStageProjectData} handleCreateProject={handleCreateProject} />
                    </div>
                </>) : (
                <>
                    <div className='mt-3 mx-2' onMouseOut={handleMouseOut}>
                        <StageTitle title={stage.stageTitle} />
                        <AddContentsBtn ref={addContentsBtnRef} stage={stage} setRegDataToSave={getStageProjectData} handleCreateProject={handleCreateProject} />
                    </div>
                </>)
            } */}
        </>
    );
});

RegiStageContents.displayName = "RegiStageContents"