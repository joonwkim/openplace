'use client';
import { User, Vote, ThumbsStatus, Knowhow, MemberRequestAndProcessStatus, MemberRequestAndProcess } from "@prisma/client";
import Card from "react-bootstrap/Card";
import { useRouter } from 'next/navigation';
import EyeFill from "./icons/eyeFill";
import Thumbup from "./icons/thumbUp";
import ThumbDown from "./icons/thumbDown";
import { getDaysFromToday } from "@/lib/dateTimeLib";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useSession } from "next-auth/react";
import style from '@/app/page.module.css';
import Fork from "./icons/fork";
import { createVoteActionAndUpdateKnowHow } from "../actions/voteAction";
import { updateKnowHowAction } from "../actions/knowhowAction";
import { createRequestProcessAction } from "../actions/memberRequestProcessAction";

type KnowHowProps = {
    knowhow: any,
};

export type VoteData = Omit<Vote, "id">;

const KnowHowItem = (props: KnowHowProps) => {
    const { knowhow } = props;
    const { data: session } = useSession();
    const router = useRouter();
    const [thumbsStatus, setThumbsStatus] = useState<ThumbsStatus>(ThumbsStatus.None);
    const [forked, setforked] = useState(false);
    const [voter, setVoter] = useState<User>(session?.user);
    const [voteLoaded, setVoteLoaded] = useState<Vote>();
    const [voteChanged, setVoteChanged] = useState(false);
    const [mouseOn, setMouseOn] = useState(false);
    const [memberRequestStatus, setMemberRequestStatus] = useState<MemberRequestAndProcessStatus>(MemberRequestAndProcessStatus.NONE);
    const [allowRegistration, setAllowRegistration] = useState(false);
    // const [mememberStatus, setMemberStatus] = useState("그룹참여신청");

    const getVote = useCallback(() => {
        if (voter !== undefined) {
            const data = knowhow.votes.filter((s: { voterId: any; }) => s.voterId === voter.id)[0] as Vote;
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

    const handleClickOnCard = async (e: any) => {
        try {
            knowhow.viewCount++;
            await updateKnowHowAction(knowhow);
            router.push(`/${props.knowhow?.id}`);
        } catch (error) {
            alert(error);
        }
    };

    const checkLoginStatus = () => {
        if (!session) {
            alert('로그인을 하셔야 선택할 수 있습니다.');
            return false;
        }
        return true;
    };

    useEffect(() => {
        console.log('use Effect:', session?.user.memberRequestedBys);
        const memberRequestedBys = session?.user.memberRequestedBys as MemberRequestAndProcess[];
        if (memberRequestedBys) {
            const request = memberRequestedBys.filter(s => s.knowhowId === knowhow.id)[0];
            if (request) {
                setMemberRequestStatus(request.memberRequestStatus);
            }
        }
        console.log('memberRequestStatus', memberRequestStatus);

    }, [knowhow.id, memberRequestStatus, session?.user]);

    useLayoutEffect(() => {
        if (voteLoaded) {
            if (voteLoaded.forked !== forked || voteLoaded.thumbsStatus !== thumbsStatus) {
                // console.log('useLayoutEffect set voteChanged: ', thumbsStatus);
                setVoteChanged(true);
            }
        } else {
            if (forked === true || thumbsStatus !== ThumbsStatus.None) {
                setVoteChanged(true);
            }
        }
    }, [thumbsStatus, forked, voteLoaded, voteChanged]);

    useEffect(() => {
        // console.log('use Effect, voteChanged', voteChanged);
        if (voteChanged && voter !== null) {
            // console.log('do something here!!', thumbsStatus, forked, voter.id, knowhow.id);
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

    const handleRequestForProcess = async () => {
        if (memberRequestStatus === MemberRequestAndProcessStatus.NONE) {
            await createRequestProcessAction(knowhow.authorId, session?.user.id, knowhow.id);
        } else if (memberRequestStatus === MemberRequestAndProcessStatus.APPROVED) {

        }
    };

    const handleMouseEnter = () => {
        if (session?.user !== undefined && session?.user.id !== knowhow?.authorId) {
            setMouseOn(true);
            const mr = knowhow.memberRequest.find((s: any) => s.requesterId === session?.user.id) as MemberRequestAndProcess;
        }
    };
    const handleMouseLeave = () => {
        setMouseOn(false);
    };

    const getCurrentRequestProcessStatus = () => {
        if (memberRequestStatus === MemberRequestAndProcessStatus.REQUESTED) {
            return '수락대기중';
        } else if (memberRequestStatus === MemberRequestAndProcessStatus.APPROVED) {
            setAllowRegistration(true);
            return '승인(그룹등록)';
        } else if (memberRequestStatus === MemberRequestAndProcessStatus.REJECTED) {
            return '멤버거절';
        } else if (memberRequestStatus === MemberRequestAndProcessStatus.PENDING) {
            return '멤버보류';
        } else if (memberRequestStatus === MemberRequestAndProcessStatus.NONE) {
            return '참여신청';
        }
        else {
            return '참여신청';
        }
    };
    return (
        <>
            <div key={knowhow?.id} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='col-sm'>
                <Card className='card shadow-lg p-1 bg-body rounded h-100' >
                    <Card.Img onClick={(e) => handleClickOnCard(e)} variant="top" src={`/images/${knowhow.thumbnailFilename}`} sizes="100vw" height={250} style={{ objectFit: 'contain', }} />
                    <Card.Body onClick={handleClickOnCard} >
                        <Card.Title className='text-center fw-bold'>{knowhow?.title}</Card.Title>
                        <Card.Text className='text-center card-text'>
                            {knowhow?.description}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-center" >
                        {mouseOn && (<div>
                            <span onClick={handleRequestForProcess} className="me-2 btn badge bg-warning text-dark">{getCurrentRequestProcessStatus()}</span>
                            <span className="me-2">작성자:</span>
                            <span className="me-2">{knowhow.author?.name}</span>
                        </div>)}
                        <small className="text-muted"> {getDaysFromToday(props.knowhow?.updatedAt as Date)} 일전
                            <EyeFill className='ms-3 me-2' />
                            <span>{knowhow?.viewCount}</span>
                            <span className="ms-3">
                                <Thumbup className={`ms-1 ${style.cursorHand}`} onClick={handleThumbUp} fill={thumbsStatus === ThumbsStatus.ThumbsUp ? "red" : ''} title="좋아요" />
                                <span className="ms-2 me-3">{knowhow.thumbsUpCount}</span>
                                <ThumbDown className={`ms-1 ${style.cursorHand}`} onClick={handleThumbDown} fill={thumbsStatus === ThumbsStatus.ThumbsDown ? "red" : ''} title="싫어요" />
                                <span className="ms-2 me-3">{knowhow.thumbsDownCount}</span>
                                <span className="mt-3">
                                    <Fork className={`ms-1 mt-1 ${style.cursorHand}`} onClick={handleforked} fill={forked ? "red" : ''} title="찜했어요" />
                                </span>
                            </span>
                        </small>
                    </Card.Footer>
                </Card>
            </div>
        </>
    );
};
export default KnowHowItem;
