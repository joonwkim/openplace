import { BulletinBoard } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import Bulletin from './bulletin'
import { getBulletinBoards, getBulletins } from '@/app/services/bulletinBoardService'
import { useSession } from 'next-auth/react'

type BulletinsProps = {
    knowhowId: string,
    // bulletins: BulletinBoard[],
    handleClickOnBulletin: (id: BulletinBoard) => void,
}

async function getBulletinsByKnowhowId(knowhowId: string): Promise<any> {
    const res = await fetch(`/api/bulletins/bulletinBoards/?knowhowId=${knowhowId}`)
    return res.json();
}

const Bulletins = ({ knowhowId, handleClickOnBulletin }: BulletinsProps) => {
    const [bulletins, setBulletins] = useState<BulletinBoard[]>([])

    useEffect(() => {
        const fetch = async () => {
            const data = await getBulletinsByKnowhowId(knowhowId);
            setBulletins(data);
        }
        fetch();
    }, [knowhowId])
    return (
        <div className='mx-3'>
            <div className='row bg-light p-1 border-bottom'>
                <div className='col-2 text-center'><h5 className='fw-bold'>항목</h5></div>
                <div className='col-5 text-left'><h5 className='fw-bold'>제목</h5></div>
                <div className='col-2 text-center'><h5 className='fw-bold'>작성자</h5></div>
                <div className='col-3 text-center'><h5 className='fw-bold'>작성일</h5></div>
            </div>
            {bulletins?.map((bulletin: BulletinBoard, index: number) => (
                <Bulletin key={index} bulletin={bulletin} index={index + 1} handleClickOnBulletin={handleClickOnBulletin} />
            ))}
            {bulletins.length === 0 && (
                <div className='mt-3 scroll-enable'>
                    등록된 게시글이 없습니다.
                </div>
            )}
        </div>
    )
}
export default Bulletins