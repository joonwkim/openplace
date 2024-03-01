'use client'
import { ThumbsStatus, User, BulletinComment } from '@prisma/client';
import React, { useState } from 'react'
import style from '@/app/page.module.css';
import Thumbup from '@/app/components/icons/thumbUp';
import ThumbDown from '@/app/components/icons/thumbDown';
import { createCommentsOnBulletinAction } from '@/app/actions/bulletinAction';


type CommentButtonsProps = {
  user: User,
  parentComment: BulletinComment,
  showAddCommentBtn: boolean,
  thumbsStatus: ThumbsStatus,
  thumbsUpCount: number,
  thumbsDownCount: number,
  handleThumbUp: () => void,
  handleThumbDown: () => void,
}

const CommentButtons = ({ user, parentComment, showAddCommentBtn, thumbsStatus, thumbsUpCount, thumbsDownCount, handleThumbUp, handleThumbDown }: CommentButtonsProps) => {

  const [showAddComment, setShowAddComment] = useState(false)
  const [comment, setComment] = useState('')

  const handleAddCommentOnComment = () => {
    if (!user) {
      alert('로그인 하셔야 답글을 달 수있습니다.')
    }
    else {
      setShowAddComment(true)
    }
  }

  const handleSaveComments = async () => {
    await createCommentsOnBulletinAction(parentComment.bulletinBoardId, parentComment.id, user.id, comment)
    setShowAddComment(false)
  }

  const handleCancelComments = () => {
    setShowAddComment(false)
  }


  return (
    <>
      <div className='d-flex'>
        <Thumbup className={`ms-1 ${style.cursorHand}`} onClick={handleThumbUp} fill={thumbsStatus === ThumbsStatus.ThumbsUp ? "red" : ''} title="좋아요" />
        <span className="ms-2 me-2">{thumbsUpCount}</span>
        <ThumbDown className={`ms-1 ${style.cursorHand}`} onClick={handleThumbDown} fill={thumbsStatus === ThumbsStatus.ThumbsDown ? "red" : ''} title="싫어요" />
        <span className="ms-2 me-3">{thumbsDownCount}</span>
        {showAddCommentBtn && (<span className="ms-3" title='대 댓글 추가' onClick={handleAddCommentOnComment}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-text" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
          </svg>
        </span>)}

        {showAddComment && (<>
          <div className='col-11'>
            <div className="input-group border-0">
              <input type="text" className="form-control border-0" placeholder="답글을 입력하세요" value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
            <div className="d-flex justify-content-md-end border-top gap-2">
              <button className="btn btn-light" type="button" onClick={handleSaveComments}>저장</button>
              <button className="btn btn-light" type="button" onClick={handleCancelComments}>취소</button>
            </div>
          </div>
        </>)}
      </div>
      {/* {JSON.stringify(comment, null, 2)} */}
    </>
  )
}
export default CommentButtons