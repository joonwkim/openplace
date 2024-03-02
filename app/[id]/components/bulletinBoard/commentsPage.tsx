import React, { useEffect, useState } from 'react'
import CommentPage from './commentPage'
import { BulletinComment, User } from '@prisma/client'

type CommentsPageProps = {
    user: User,
    initialComments: BulletinComment[],
    handleSaveReplyComment: (bulletinBoardId: string, parentCommentId: string, userId: string, comment: string) => void,
}

const CommentsPage = ({ user, initialComments, handleSaveReplyComment }: CommentsPageProps) => {
    const [comments, setComments] = useState<BulletinComment[]>([])
    useEffect(() => {
        setComments(initialComments);
    }, [initialComments])
    return (<>
        {comments?.map((comment: BulletinComment, index: number) => (
            <CommentPage key={index} comment={comment} user={user} handleSaveReplyComment={handleSaveReplyComment} />
        ))}
    </>)
}

export default CommentsPage

