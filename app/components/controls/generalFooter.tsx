'use client';
import EyeFill from '@/app/components/icons/eyeFill';
import Fork from '@/app/components/icons/fork';
import ThumbDown from '@/app/components/icons/thumbDown';
import Thumbup from '@/app/components/icons/thumbUp';
import { getDaysFromToday, getHoursFromToday, getMinsFromToday } from '@/lib/dateTimeLib';
import { Knowhow, MembershipRequest, MembershipRequestStatus, ThumbsStatus, User, Vote } from '@prisma/client';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import style from '@/app/page.module.css';
import { VoteData } from '../knowHowItem';
import { createVoteActionAndUpdateKnowHow } from '@/app/actions/voteAction';
import { getMembershipApprovalStatus } from '@/app/lib/membership';

interface FooterProps {
    knowhow: any,
    session: any;
}

export const GeneralFooter = (props: FooterProps) => {
    const { knowhow, session } = props;
    const [thumbsStatus, setThumbsStatus] = useState<ThumbsStatus>(ThumbsStatus.None);
    const [forked, setforked] = useState(false);
    const [voter, setVoter] = useState<User>(session?.user);
    const [voteLoaded, setVoteLoaded] = useState<Vote>();
    const [voteChanged, setVoteChanged] = useState(false);

    //! vote and fork
    // login status
    const checkLoginStatus = () => {
        if (!session) {
            alert('로그인을 하셔야 선택할 수 있습니다.');
            return false;
        }
        else if (session?.user?.id === knowhow.author?.id) {
            alert('작성자는 자기에게 좋아요를 선택할 수 없습니다.');
            return false;
        }
        return true;
    };
    const getVote = useCallback(() => {
        if (voter !== undefined) {
            const data = knowhow.votes?.filter((s: { voterId: any; }) => s.voterId === voter.id)[0] as Vote;
            if (data) {
                setVoteLoaded(data);
                setThumbsStatus(data.thumbsStatus);
                setforked(data.forked);
            }
            setVoteChanged(false);
        }
    }, [knowhow.votes, voter]);

    useLayoutEffect(() => {
        setVoter(session?.user);
        getVote();
    }, [getVote, session?.user]);


    useLayoutEffect(() => {
        if (voteLoaded) {
            if (voteLoaded.forked !== forked || voteLoaded.thumbsStatus !== thumbsStatus) {
                setVoteChanged(true);
            }
        } else {
            if (forked === true || thumbsStatus !== ThumbsStatus.None) {
                setVoteChanged(true);
            }
        }
    }, [thumbsStatus, forked, voteLoaded, voteChanged]);

    useEffect(() => {
        if (voteChanged && voter !== null) {
            const voteToVote: VoteData = {
                thumbsStatus: thumbsStatus,
                forked: forked,
                knowHowId: knowhow.id,
                voterId: voter.id,
            };
            createVoteActionAndUpdateKnowHow(knowhow, voter, voteToVote);
        }
    }, [forked, knowhow, knowhow.id, thumbsStatus, voteChanged, voter]);

    const handleThumbUp = (e: any) => {
        if (checkLoginStatus()) {
            if (thumbsStatus === ThumbsStatus.None) {
                setThumbsStatus(ThumbsStatus.ThumbsUp);
                knowhow.thumbsUpCount++;
            } else if (thumbsStatus === ThumbsStatus.ThumbsDown) {
                setThumbsStatus(ThumbsStatus.ThumbsUp);
                knowhow.thumbsUpCount++;
                knowhow.thumbsDownCount--;
            } else if (thumbsStatus === ThumbsStatus.ThumbsUp) {
                setThumbsStatus(ThumbsStatus.None);
                knowhow.thumbsUpCount--;
            }
        }
    };

    const handleThumbDown = (e: any) => {
        if (checkLoginStatus()) {
            if (thumbsStatus === ThumbsStatus.None) {
                setThumbsStatus(ThumbsStatus.ThumbsDown);
                knowhow.thumbsDownCount++;

            } else if (thumbsStatus === ThumbsStatus.ThumbsDown) {
                setThumbsStatus(ThumbsStatus.None);
                knowhow.thumbsDownCount--;

            } else if (thumbsStatus === ThumbsStatus.ThumbsUp) {
                setThumbsStatus(ThumbsStatus.ThumbsDown);
                knowhow.thumbsDownCount++;
                knowhow.thumbsUpCount--;
            }
        }
    };

    const handleforked = (e: any) => {
        if (checkLoginStatus()) {
            if (forked === true) {
                setforked(false);
            }
            else {
                setforked(true);
            }
        }
    };

    const getDaysOrHoursFromNow = () => {
        const days = getDaysFromToday(props.knowhow?.createdAt);
        const hours = getHoursFromToday(props.knowhow?.createdAt);
        const mins = getMinsFromToday(props.knowhow?.createdAt);
        if (days > 0) {
            return (<>{days} <span>일전</span></>);
        } else if (hours > 0) {
            return (<>{hours} <span>시간전</span></>);
        }
        return (<>{mins} <span>분전</span></>);
    };

    return (
        <div>
            <small className="text-muted">
                {getDaysOrHoursFromNow()}
                <EyeFill className='ms-3 me-2' />
                <span>{knowhow?.viewCount}</span>
                <span className="ms-3 me-2">
                    <Thumbup className={`ms-1 ${style.cursorHand}`} onClick={handleThumbUp} fill={thumbsStatus === ThumbsStatus.ThumbsUp ? "red" : ''} title="좋아요" />
                    <span className="ms-2 me-3">{knowhow.thumbsUpCount}</span>
                    <ThumbDown className={`ms-1 ${style.cursorHand}`} onClick={handleThumbDown} fill={thumbsStatus === ThumbsStatus.ThumbsDown ? "red" : ''} title="싫어요" />
                    <span className="ms-2 me-3">{knowhow.thumbsDownCount}</span>
                    <span className="mt-3">
                        <Fork className={`ms-1 mt-1 ${style.cursorHand}`} onClick={handleforked} fill={forked ? "red" : ''} title="찜했어요" />
                    </span>
                </span>
                <span className='ms-3'>
                    {getMembershipApprovalStatus(session?.user, knowhow.id)}
                </span>
            </small>
        </div>
    );
};

export default GeneralFooter;