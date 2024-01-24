'use client';
import './multiItemsCarousel.css';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import StageTitle from '@/app/knowhow/[id]/components/stageTitle';
import ArrowDown from '@/app/knowhow/[id]/components/arrowDown';
import { ChildHeader, ChildDetail, ChildStage, Stage, ChildData } from '@/app/lib/types';
import { AddChildBtn, } from './AddChildBtn';
import ChildThumbnail from './childThumbnail';
type StageContentProps = {
    stage: Stage,
    handleCreateChild: () => void,
    setRegDataToSave: (data: any) => void,
    editMode: boolean | undefined,
    // isGroupType: boolean | undefined,
};

export const ChildContents = forwardRef<any, StageContentProps>(({ stage, handleCreateChild, setRegDataToSave, editMode, }: StageContentProps, ref) => {
    const addChildBtnRef = useRef<any>(null);
    const [data, setData] = useState<ChildData>()
    // const [childHeader, setChildHeader] = useState<any>()
    // const [childDetail, setChildDetail] = useState<any>()
    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                setRegDataToSave(data);
            }
        }),
    );

    const handleShowContents = () => {
        alert('handleShowContents clicked')
    }
    const getChildData = (data: ChildData) => {
        // console.log('data getChildData ChildContents header: ', JSON.stringify(data.header, null, 2))
        setData(data)
        // setChildHeader(childHeader)
        // setChildDetail(childDetail)
    }
    const handleMouseOut = () => {
        addChildBtnRef.current?.handleSubmit();
    }

    const hdl = () => {
        // alert('hdl clicked')
        // console.log('data hdl: ', JSON.stringify(data, null, 2))

        handleCreateChild();
    }

    return (
        <>
            {stage && <div className='mt-3 mx-2' onMouseOut={handleMouseOut}>
                <StageTitle title={stage.stageTitle} />
                <ArrowDown />
                {stage.children && stage.children?.length > 0 && (<>
                    {stage.children.map((child: ChildStage, index: number) => (<div key={index}>
                        {child.thumbnailUrl && <ChildThumbnail key={index} title={child.title} src={child.thumbnailUrl} onClick={handleShowContents} />}
                    </div>))}
                </>)}
                <AddChildBtn ref={addChildBtnRef} stage={stage} setRegDataToSave={getChildData} handleCreateChild={hdl} />

            </div>}






        </>
    );
});

ChildContents.displayName = "ChildContents"