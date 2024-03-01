import prisma from '@/prisma/prisma'
import { BulletinComment } from '@prisma/client';



export async function getBulletinComments(bulletinBoardId: string) {
    try {
        const bcs = await prisma.bulletinComment.findMany({
            where: {
                bulletinBoardId: bulletinBoardId
            },
            include: {
                commentWriter: true,
                parentBulletinComment: true,
                children: true,
                bulletinCommentVotes: true,
            }
        })
        // console.log(bcs)
        return bcs
    } catch (error) {
        return ({ error })
    }
}
export async function getBulletins(knowhowId: string) {
    try {
        const bbs = await prisma.bulletinBoard.findMany({
            where: {
                knowhowId: knowhowId
            },
            include: {
                writer: true,
                bulletinComments: {
                    include: {
                        bulletinBoard: true,
                        commentWriter: true,
                        parentBulletinComment: true,
                        children: {
                            include: {
                                bulletinBoard: true,
                                commentWriter: true,
                                parentBulletinComment: true,
                                children: true,
                            }
                        }
                    }
                }
            }
        })
        // console.log(bbs)
        return bbs
    } catch (error) {
        return ({ error })
    }
}
export async function getBulletinBoards() {
    try {
        const bbs = await prisma.bulletinBoard.findMany({
            include: {
                knowhow: true,
                writer: true,
                bulletinComments: true,
            }
        })
        // console.log(bbs)
        return bbs
    } catch (error) {
        return ({ error })
    }
}

export async function createBulletin(knowhowId: string, writerId: string, title: string, message: string) {
    const bulletin = await prisma.bulletinBoard.create({
        data: {
            title: title,
            knowhowId: knowhowId,
            writerId: writerId,
            message: message,
        }
    })
    console.log('bulletin created:', bulletin)
}
export async function createCommentsOnBulletin(bulletinBoardId: string, parentCommentId: string | null, writerId: string, comment: string) {
    const cmt = await prisma.bulletinComment.create({
        data: {
            bulletinBoardId: bulletinBoardId,
            commentWriterId: writerId,
            comment: comment,
            parentBulletinCommentId: parentCommentId,
        }
    })
    console.log('comment on bulletin created:', cmt)
}

export async function updateComment(comment: BulletinComment) {
    try {
        if (comment === null) {
            return;
        }
        try {
            const kn = await prisma.bulletinComment.update({
                where: {
                    id: comment.id
                },
                data: {
                    thumbsUpCount: comment.thumbsUpCount,
                    thumbsDownCount: comment.thumbsDownCount,
                },
                include: {
                    bulletinCommentVotes: true,
                    commentWriter: true,
                }
            });
            return kn;
        } catch (error) {
            console.log('update knowhow error:', error);
        }
    } catch (error) {
        console.log('createKnowHow error:', error);
    }
}
