'use client'
import { BulletinBoard, User } from '@prisma/client'
import React, { useState } from 'react'
import parser from 'html-react-parser';
import CommentBoard from './commentBoard';
import { json } from 'stream/consumers';
type BulletinDetailProps = {
    user: User,
    bulletin: BulletinBoard | any,
}

const BulletinDetail = ({ user, bulletin }: BulletinDetailProps) => {
    // console.log(bulletin)
    // console.log('bulletin.bulletinComments.filter((s: any) => s.parentBulletinComment === null)', bulletin.bulletinComments.filter((s: any) => s.parentBulletinCommentId === null))
    const [rootComments, setRootComment] = useState(bulletin.bulletinComments.filter((s: any) => s.parentBulletinCommentId === null))
    return (
        <div className='p-3'>
            <div className='row boarder-bottom'>
                <div className='col-1 bg-secondary text-light pt-2 '><h5>제목</h5></div>
                <div className='col-6 pt-2'><h5>{bulletin.title}</h5> </div>
                <div className='col-1 bg-secondary text-light pt-2 '><h5>이메일</h5></div>
                <div className='col-4 pt-2'>{bulletin.writer.email}</div>
            </div>
            <div className='row boarder-bottom'>
                <div className='col-1 bg-secondary text-light '><h5>작성자</h5></div>
                <div className='col-6 pt-2'>{bulletin.writer.name}</div>
                <div className='col-1 bg-secondary text-light '><h5>작성일</h5></div>
                <div className='col-4 pt-2'>{bulletin.createdAt.toLocaleString()}</div>
            </div>
            <div className='my-3 p-3'>{parser(bulletin.message)}</div>
            <CommentBoard comments={rootComments} user={user} bulletinBoardId={bulletin.id} />
        </div>

    )
}

export default BulletinDetail