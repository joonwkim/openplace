import { convertToLocaleDateTime } from '@/lib/dateTimeLib'
import { BulletinBoard } from '@prisma/client'
import React from 'react'

type BulletinProps = {
    bulletin: BulletinBoard | any,
    index: number,
    handleClickOnBulletin: (bulletin: BulletinBoard) => void,
}

const Bulletin = ({ bulletin, index, handleClickOnBulletin }: BulletinProps) => {
    return (
        <>
            <div className='row p-1 border-top' onClick={() => handleClickOnBulletin(bulletin)}>
                <div className='col-2 text-center'>{index}</div>
                <div className='col-5 text-left'>{bulletin.title}</div>
                <div className='col-2 text-center'>{bulletin.writer.name}</div>
                <div className='col-3 text-center'>{convertToLocaleDateTime(bulletin.createdAt)}</div>
            </div>
        </>
    )
}
export default Bulletin