'use client';
import Image from 'next/image';
import { Card, } from 'react-bootstrap';
import './scroll.css';
import new_logo_cross from '@/public/svgs/new_logo_cross.svg'
import { MouseEventHandler, useRef, useState } from 'react';
import { RegisterProjectKnowhow } from './registerProjectKnowhow';
import { consoleLogFormData } from '@/app/lib/formdata';

type RegProps = {
    onClick: MouseEventHandler<HTMLDivElement>
}
const RegisterContents = (props: RegProps) => {
    const registerProjectKnowhowRef = useRef<any>(null)
    const [disableCreateBtn, setDisableCreateBtn] = useState(false)
    const [data, setData] = useState<any>()

    const handleCreateKnowhowProject = () => {
        // alert('handleCreateKnowhowProject');
        const { genFormData, ytData, imgFormData, pdfFormData, text } = data;
        // console.log('create project knowhow:', JSON.stringify(ytData, null, 2))
    }
    const onMouseLeaveFromModalContents = () => {
        // alert('onMouseLeaveFromModalContents');
        registerProjectKnowhowRef.current?.handleSubmit()
    }
    const getProjectKnowhowData = (projectData: any) => {
        //knowhow data를 다가져옴 from RegisterProjectKnowhow의 useImperativeHandle 로 부터
        const { genFormData, ytData, imgFormData, pdfFormData, text } = projectData;
        // consoleLogFormData('getProjectKnowhowData genFormData:', genFormData)
        // consoleLogFormData('getProjectKnowhowData imgFormData:', imgFormData)
        // consoleLogFormData('getProjectKnowhowData pdfFormData:', pdfFormData)
        // console.log('ytData', JSON.stringify(ytData, null, 2))
        // console.log('ytData', text)
        setData(projectData)

    };
    return (<>
        <div className='cross-container mt-2' onClick={props.onClick} data-bs-toggle="modal" data-bs-target="#staticBackdropForAddKnowhowProject">
            <div className='cross-btn mt-5'>
                <Image
                    priority
                    src={new_logo_cross}
                    height={100}
                    width={100}
                    alt="cross"
                />
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
                        <RegisterProjectKnowhow ref={registerProjectKnowhowRef} setRegDataToSave={getProjectKnowhowData} editMode={false} projectType={false} />
                    </div>
                    <div className="modal-footer">
                        <button type="submit" form="profileChangeForm" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleCreateKnowhowProject} disabled={disableCreateBtn}>생성</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                    </div>
                </div>
            </div>
        </div>
    </>

    )
}

export default RegisterContents