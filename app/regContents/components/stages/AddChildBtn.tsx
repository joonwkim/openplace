'use client';
import Image from 'next/image';
import { Card, } from 'react-bootstrap';
import './multiItemsCarousel.css';
import new_logo_cross from '@/public/svgs/new_logo_cross.svg'
import { MouseEventHandler, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { any } from 'zod';
import { ChildDetail, ChildContents, Stage } from '@/app/lib/types';
import { ChildProject } from './childProject';
import { ChildHeaderPage } from './childHeaderPage';
import { RegiOtherDatails } from '../regiOtherDetails';
import { Col, Form, Row, } from 'react-bootstrap';
import ImgUploader from '@/components/controls/imgUploader';
import styles from '@/app/regContents/page.module.css';
import { getSecureUrl } from '@/app/lib/formdata';
import { getFormdata } from '../../lib/formData';
import { useSession } from 'next-auth/react';
import { DropzoneOptions } from 'react-dropzone';

type AddChildBtnProps = {
    stage: Stage,
    handleCreateChild: () => void,
    setRegDataToSave: (data: any) => void,
};

export const AddChildBtn = forwardRef<any, AddChildBtnProps>(({ stage, handleCreateChild, setRegDataToSave }: AddChildBtnProps, ref) => {
    const childProjectRef = useRef<any>(null)
    const childDetailsRef = useRef<any>(null)
    const [disableCreateBtn, setDisableCreateBtn] = useState(false)
    const [child, setChild] = useState<ChildContents>()
    const [childDetail, setChildDetail] = useState<ChildDetail>()
    const [currentStage, setCurrentStage] = useState<Stage>()
    const [file, setFile] = useState<any>();
    const childHeaderFormRef = useRef<any>();
    const [validated, setValidated] = useState(false);
    const { data: session } = useSession();
    const [thumbnail, setThumbnail] = useState('')

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                if (child && childDetail) {
                    child.ChildDetail = childDetail;
                }
                setRegDataToSave(child);
                console.log('child ', JSON.stringify(child, null, 2))
            }
        }),
    );

    const handlAddContents = () => {
        setThumbnail('')
        // childHeaderFormRef.current.reset();
        console.log('stage', JSON.stringify(stage, null, 2))
    }

    const onDrop = useCallback(async (files: File[]) => {
        setFile(Object.assign(files[0], { secure_url: URL.createObjectURL(files[0]) }));
        setThumbnail(URL.createObjectURL(files[0]))
    }, []);

    const options: DropzoneOptions = {
        accept: { 'image/*': [] }, maxSize: 1024 * 1000, maxFiles: 1, onDrop
    };

    const onMouseLeaveFromModalContents = () => {
        childProjectRef.current?.handleSubmit()
    }
    const handleSubmit = async (form: any) => {
        try {
            alert('handleSubmit')
        } catch (error) {
            console.log('handleSubmit in regiGeneral error: ', error);
        }
    };

    const handleCreateChildContents = async () => {

        const formData = new FormData(childHeaderFormRef.current);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        // const td = await getFormdata(file, 'openplace');
        // td.append('path', file.path);

        // const child: ChildContents = {
        //     title: title,
        //     description: description,
        //     thumbnailFormdata: td,
        //     thumbnailUrl: getSecureUrl(td),
        //     authorId: session?.user.id,
        // }

        // setChild(child)
        // setFile(null);
        // formData.set('title', '')
    }

    return (<>
        <div className='cross-container mt-2' onClick={handlAddContents} data-bs-toggle="modal" data-bs-target="#staticBackdropForAddKnowhowProject">
            <div className='cross-btn mt-5'>
                <Image priority src={new_logo_cross} height={100} width={100} alt="cross" />
            </div>
            <div className='add-stage-btn text-center'>컨텐츠 등록하기</div>
            {stage.stage}
        </div>

    </>

    )
});
AddChildBtn.displayName = "AddChildBtn"