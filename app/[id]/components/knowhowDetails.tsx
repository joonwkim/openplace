'use client';
import React from 'react';

import { Knowhow, } from '@prisma/client';
import { DispYoutube } from './dispYoutube';
import { DispImages } from './dispImages';
import { DispText } from './dispText';
import DispGeneral from './dispGeneral';
import { DispPdfFiles } from './dispPdfFiles';

type RegProps = {
    knowhow: any | Knowhow,
};

const KnowhowDetails = ({ knowhow }: RegProps) => {

    return (
        <>
         <div className='mt-3'>
                <button className='me-3 btn btn-primary'  type="submit">멤버 보기</button>
                <button className='me-3 btn btn-primary'  type="submit">채 팅</button>
                <button className='me-3 btn btn-primary'  type="submit">화상회의</button>
                <button className='me-3 btn btn-primary'  type="submit">공지사항</button>
                <button className='me-3 btn btn-primary'  type="submit">게시판</button>

            </div>
            <DispGeneral knowhow={knowhow} />
            <DispYoutube videoIds={knowhow?.knowhowDetailInfo?.videoIds} thumbnailType="medium" />
            <DispImages imgFileNames={knowhow?.knowhowDetailInfo?.imgFileNames} />
            <DispPdfFiles pdfFileNames={knowhow?.knowhowDetailInfo?.pdfFileNames} />
            <DispText detailText={knowhow?.knowhowDetailInfo?.detailText} />
        </>
    );
};

export default KnowhowDetails;