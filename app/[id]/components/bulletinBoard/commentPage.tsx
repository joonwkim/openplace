'use client'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { BulletinComment, BulletinCommentVote, ThumbsStatus, User, } from '@prisma/client'
import UserThumbnail from '@/components/controls/userThumbnail'
import GeneralFooter from '@/app/components/controls/generalFooter'
import CommentButtons from './commentButtons'
import { getDaysFromToday, getHoursFromToday, getMinsFromToday } from '@/lib/dateTimeLib'
import CommentsPage from './commentsPage'
import { useSession, } from 'next-auth/react';
import { createCommentVoteActionAndUpdateComment } from '@/app/actions/voteAction'

type CommentPageProps = {
    user: User,
    comment: BulletinComment | any,
}

const CommentPage = ({ user, comment }: CommentPageProps) => {
    const [showChild, setShowChild] = useState(false)
    const { data: session } = useSession();
    const [voter, setVoter] = useState<User>(session?.user);
    const [voteLoaded, setVoteLoaded] = useState<BulletinCommentVote>();
    const [voteChanged, setVoteChanged] = useState(false);
    const [thumbsStatus, setThumbsStatus] = useState<ThumbsStatus>(ThumbsStatus.None);

    const getVote = useCallback(() => {
        if (voter !== undefined) {
            const data = comment.commentVotes?.filter((s: { voterId: any; }) => s.voterId === voter.id)[0] as BulletinCommentVote;
            if (data) {
                setVoteLoaded(data);
                setThumbsStatus(data.thumbsStatus);
            }
            setVoteChanged(false);
        }
    }, [comment.commentVotes, voter]);

    useLayoutEffect(() => {
        setVoter(session?.user);
        getVote();
    }, [getVote, session?.user]);


    useLayoutEffect(() => {
        if (voteLoaded) {
            if (voteLoaded.thumbsStatus !== thumbsStatus) {
                setVoteChanged(true);
            }
        } else {
            if (thumbsStatus !== ThumbsStatus.None) {
                setVoteChanged(true);
            }
        }
    }, [thumbsStatus, voteLoaded, voteChanged]);

    useEffect(() => {
        if (voteChanged && voter !== null) {
            const voteToVote = {
                thumbsStatus: thumbsStatus,
                knowHowId: comment.id,
                voterId: voter.id,
            };
            createCommentVoteActionAndUpdateComment(comment, voter, voteToVote);
        }
    }, [comment, thumbsStatus, voteChanged, voter]);

    const checkLoginStatus = (bulletinComment: BulletinComment | any) => {
        if (!session) {
            alert('로그인을 하셔야 선택할 수 있습니다.');
            return false;
        }
        else if (session?.user?.id === bulletinComment.commentWriter.id) {
            alert('작성자는 자기에게 좋아요를 선택할 수 없습니다.');
            return false;
        }
        return true;
    };

    const handleThumbUp = (bulletinComment: BulletinComment) => {
        if (checkLoginStatus(bulletinComment)) {
            console.log('thumbsStatus: ', thumbsStatus)
            console.log('thumbsUpCount: ', comment.thumbsUpCount)
            if (thumbsStatus === ThumbsStatus.None) {
                setThumbsStatus(ThumbsStatus.ThumbsUp);
                bulletinComment.thumbsUpCount++;
            } else if (thumbsStatus === ThumbsStatus.ThumbsDown) {
                setThumbsStatus(ThumbsStatus.ThumbsUp);
                bulletinComment.thumbsUpCount++;
                bulletinComment.thumbsDownCount--;
            } else if (thumbsStatus === ThumbsStatus.ThumbsUp) {
                setThumbsStatus(ThumbsStatus.None);
                bulletinComment.thumbsUpCount--;
            }
        }
    };

    const handleThumbDown = (bulletinComment: BulletinComment) => {
        if (checkLoginStatus(bulletinComment)) {
            if (thumbsStatus === ThumbsStatus.None) {
                setThumbsStatus(ThumbsStatus.ThumbsDown);
                bulletinComment.thumbsDownCount++;

            } else if (thumbsStatus === ThumbsStatus.ThumbsDown) {
                setThumbsStatus(ThumbsStatus.None);
                bulletinComment.thumbsDownCount--;

            } else if (thumbsStatus === ThumbsStatus.ThumbsUp) {
                setThumbsStatus(ThumbsStatus.ThumbsDown);
                bulletinComment.thumbsDownCount++;
                bulletinComment.thumbsUpCount--;
            }
        }
    };

    const getDaysOrHoursFromNow = (date: Date) => {
        const days = getDaysFromToday(date);
        const hours = getHoursFromToday(date);
        const mins = getMinsFromToday(date);
        if (days > 0) {
            return (<>{days} <span>일전</span></>);
        } else if (hours > 0) {
            return (<>{hours} <span>시간전</span></>);
        }
        return (<>{mins} <span>분전</span></>);
    };

    return (
        <>
            <div className='row  mt-2'>
                <div className='col'>
                    <div className='ms-4 mt-2'>
                        <UserThumbnail user={comment.commentWriter} />
                    </div>
                </div>
                <div className='hand-cursor col-11 mt-2'>
                    {comment.comment}
                    <div className='d-flex'>
                        <div className='fs-6' title={comment.commentWriter?.email}> {comment.commentWriter?.name}</div>
                        {comment?.createdAt && (<div className='fs-6 ms-4'>{getDaysOrHoursFromNow(comment?.createdAt)}</div>)}
                    </div>
                    <div className='d-flex'>
                        <CommentButtons user={user} parentComment={comment} showAddCommentBtn={true} thumbsStatus={thumbsStatus}
                            thumbsUpCount={comment.thumbsUpCount} thumbsDownCount={comment.thumbsDownCount} handleThumbUp={() => handleThumbUp(comment)} handleThumbDown={() => handleThumbDown(comment)} />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                </div>
                <div className='col-11'>
                    {comment?.children?.length > 0 && (
                        <>
                            {!showChild && (<>
                                <span onClick={(() => { setShowChild(!showChild) })}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                </svg></span> 답글 <span>{comment?.children.length}</span>개
                            </>)}
                            {showChild && (<>
                                <div className='mt-2'><span className='me-2' onClick={(() => { setShowChild(!showChild) })}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg></span>답글<span>{comment?.children.length}</span></div>

                                {comment?.children.map((child: BulletinComment | any, index: number) => (
                                    <div key={index} className='row mt-1'>
                                        {/* {JSON.stringify(child, null, 2)} */}
                                        <div className='col'>
                                            <UserThumbnail user={child.writer} />
                                        </div>
                                        <div className='col-11 mt-1'>
                                            {child.comment}
                                            <div className='d-flex'>
                                                <div className='fs-6' title={child.commentWriter?.email}> {child.commentWriter?.name}</div>
                                                {child?.createdAt && (<div className='fs-6 ms-4'>{getDaysOrHoursFromNow(child?.createdAt)}</div>)}
                                            </div>
                                            <CommentButtons user={user} parentComment={comment} showAddCommentBtn={false} thumbsStatus={thumbsStatus} thumbsUpCount={child.thumbsUpCount}
                                                thumbsDownCount={child.thumbsDownCount} handleThumbUp={() => handleThumbUp(child)} handleThumbDown={() => handleThumbDown(child)} />
                                        </div>
                                    </div>
                                ))}
                            </>)}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default CommentPage