'use client'
import React, { useState } from 'react'
import CommentPage from './commentPage'
import { BulletinComment, User } from '@prisma/client'

type CommentsPageProps = {
    user: User,
    initComments: BulletinComment[],
}

const CommentsPage = ({ user, initComments }: CommentsPageProps) => {
    const [comments, setComments] = useState<BulletinComment[]>(initComments)

    return (<>
        {comments?.map((comment: BulletinComment, index: number) => (
            <CommentPage key={index} comment={comment} user={user} />
        ))}
    </>)
}

export default CommentsPage

