'use client'
import React, { useState } from 'react'
import { BulletinComment, User } from '@prisma/client'
import UserThumbnail from '@/components/controls/userThumbnail'
import { createCommentsOnBulletinAction } from '@/app/actions/bulletinAction'
import CommentPage from './commentPage'
import CommentsPage from './commentsPage'

type CommentBoardProps = {
    user: User,
    bulletinBoardId: string,
    comments: BulletinComment[],
}
const CommentBoard = ({ user, comments, bulletinBoardId }: CommentBoardProps) => {
    const [showComments, setShowComments] = useState(true)
    const [showCommentsInputAndBtn, setShowCommentsInputAndBtn] = useState(false)
    const [comment, setComment] = useState('')

    const handleClickOnChatBtn = () => {
        setShowComments(!showComments)
    }
    const handleClickOnSortBtn = () => {
        alert('not implemented yet')
    }
    const handleWriteComments = async () => {
        if (!user) {
            alert('로그인 하셔야 댓글을 달 수있습니다.')
        }
        else {
            setShowCommentsInputAndBtn(true)
        }

    }
    const handleSaveComments = async () => {
        await createCommentsOnBulletinAction(bulletinBoardId, null, user.id, comment)
        setShowCommentsInputAndBtn(false)
    }
    const handleCancelComments = () => {
        setShowCommentsInputAndBtn(false)
    }
    return (
        <div>
            <div className='d-flex justify-content-start'>
                <div className='fs-5 me-1'>댓글 보기</div>
                <div className="fs-5 me-3" title='댓글 보기' onClick={handleClickOnChatBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" className="bi bi-chat-text" viewBox="0 0 16 16">
                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"></path>
                        <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8m0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5"></path>
                    </svg>
                </div>
                <div className='fs-5 me-1'>정렬</div>
                <div className="fs-5 me-3" title='보기순' onClick={handleClickOnSortBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-filter-left" viewBox="0 0 16 16">
                        <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                    </svg>
                </div>
            </div>

            {showComments &&
                <div className='row  mt-3'>
                    <div className='col'>
                        <div className='ms-4 mt-4'>
                            <UserThumbnail user={user} />
                        </div>
                    </div>
                    {!showCommentsInputAndBtn && (<>
                        <div className='hand-cursor col-11 mt-3' onClick={handleWriteComments}>댓글 추가</div>
                    </>)}
                    {showCommentsInputAndBtn && (<>
                        <div className='col-11'>
                            <div className="input-group border-0">
                                <textarea className="form-control border-0" placeholder="답글을 입력하세요" value={comment} onChange={(e) => setComment(e.target.value)} />
                            </div>
                            <div className="d-flex justify-content-md-end border-top gap-2">
                                <button className="btn btn-light" type="button" onClick={handleSaveComments}>저장</button>
                                <button className="btn btn-light" type="button" onClick={handleCancelComments}>취소</button>
                            </div>
                        </div>
                    </>)}
                </div>
            }

            <CommentsPage initComments={comments} user={user} />
        </div>
    )
}

export default CommentBoard