'use client';
import Image from 'next/image';
import { Card, } from 'react-bootstrap';
import './multiItemsCarousel.css';
import new_logo_cross from '@/public/svgs/new_logo_cross.svg'
import { MouseEventHandler, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { RegiStageProject } from './regiStageProject';
import { any } from 'zod';
import { Stage } from '@/app/lib/types';

type RegProps = {
    // onClick: MouseEventHandler<HTMLDivElement>,
    stage: Stage,
    handleCreateProject: () => void,
    setRegDataToSave: (data: any) => void,
};


export const AddContentsBtn = forwardRef<any, RegProps>(({ stage, handleCreateProject, setRegDataToSave }: RegProps, ref) => {
    const registerProjectKnowhowRef = useRef<any>(null)
    const [disableCreateBtn, setDisableCreateBtn] = useState(false)
    const [stageProjectHeaderData, setStageProjectHeaderData] = useState<any>()
    const [stageProjectDetailData, setStageProjectDetailData] = useState<any>()

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                setRegDataToSave({ stageProjectHeaderData, stageProjectDetailData });
            }
        }),
    );

    const onMouseLeaveFromModalContents = () => {
        registerProjectKnowhowRef.current?.handleSubmit()
    }

    const getProjectKnowhowData = ({ stageProjectHeaderData, stageProjectDetailData }: { stageProjectHeaderData: any, stageProjectDetailData: any }) => {
        setStageProjectHeaderData(stageProjectHeaderData)
        setStageProjectDetailData(stageProjectDetailData)
    };


    return (<>
        <div className='cross-container mt-2' data-bs-toggle="modal" data-bs-target="#staticBackdropForAddKnowhowProject">
            <div className='cross-btn mt-5'>
                <Image priority src={new_logo_cross} height={100} width={100} alt="cross" />
            </div>
            <div className='add-stage-btn text-center'>컨텐츠 등록하기</div>
        </div>
        <div className="modal modal-xl fade" id="staticBackdropForAddKnowhowProject" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropForAddKnowhowProjectLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title" id="staticBackdropForAddKnowhowProjectLabel">단계별 프로젝트</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" onMouseLeave={onMouseLeaveFromModalContents}>
                        <RegiStageProject ref={registerProjectKnowhowRef} setRegDataToSave={getProjectKnowhowData} stage={stage} />
                    </div>
                    <div className="modal-footer">
                        {/* <button type="submit" form="profileChangeForm" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleCreateKnowhowProject(stage.stage)} disabled={disableCreateBtn}>생성</button> */}
                        <button type="submit" form="profileChangeForm" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleCreateProject} disabled={disableCreateBtn}>생성</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                    </div>
                </div>
            </div>
        </div>
    </>

    )
});
AddContentsBtn.displayName = "AddContentsBtn"