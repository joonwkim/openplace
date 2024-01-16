'use client';
import Image from 'next/image';
import { Card, } from 'react-bootstrap';
import './scroll.css';
import { Cross } from '@/app/auth/register/styles';
import new_logo_cross from '@/public/svgs/new_logo_cross.svg'
import { Stage } from '@/lib/type';
import StageTitle from './stageTitle';
import ArrowDown from './arrowDown';
import RegisterContents from './registerContents';
import DisplayKnowhowThumnail from './displayKnowhowThumnail';
import thumbNailImage from '@/public/images/thumbNailImage.png'
import { MouseEventHandler } from 'react';
type GenProps = {
    stage: Stage,
    onClick: MouseEventHandler<HTMLDivElement>
};

const DispSelfContents = (props: GenProps) => {
    const { stage } = props;

    const handleShowContents = () => {
        alert('handleShowContents clicked')
    }

    return (
        <>
            {stage && stage.thumbnailUrl ? (
                <>
                    <div className='mt-3 mx-2'>
                        <StageTitle title={stage.stageTitle} />
                        <ArrowDown />
                        {stage.stages && stage.stages?.length > 0 && (<>
                            {stage.stages.map((s: Stage, index: number) => (<>
                                {s.thumbnailUrl && <DisplayKnowhowThumnail key={index} title={stage.stageTitle} src={s.thumbnailUrl} onClick={handleShowContents} />}
                                <ArrowDown />
                            </>))}
                        </>)}
                        <RegisterContents onClick={props.onClick} />
                    </div>
                </>) : (
                <>
                    <div className='mt-3 mx-2'>
                        <StageTitle title={stage.stageTitle} />
                        <ArrowDown />
                        <RegisterContents onClick={() => { props.onClick }} />
                    </div>
                </>)
            }
        </>);
};

export default DispSelfContents;
