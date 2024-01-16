'use client';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { Knowhow } from '@prisma/client';
import { useSession, } from 'next-auth/react';
import { createMembershipRequestAction } from '@/app/actions/membershipRequestAction';
import { getMembershipApprovalStatus } from '@/app/lib/membership';
import { useRouter } from 'next/navigation';
import { getCloudinaryImgData, getCloudinaryPdfData, } from '@/app/lib/arrayLib';
import './scroll.css';

import DispGeneral from '@/app/[id]/components/dispGeneral';
import DispSelfContents from './displaySelfContents';
import { ImportsNotUsedAsValues } from 'typescript';
import DisplayProjectStages from './displayProjectStages';
import { url } from 'inspector';
import { Card } from 'react-bootstrap';
import { Stage } from '@/app/lib/types';



type RegProps = {
    knowhow: any | Knowhow,
};



const KnowhowDetails = ({ knowhow }: RegProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [showDetailContents, setShowDetailContents] = useState(false);
    const [showChildrenContents, setShowChildrenContents] = useState(true);
    const [showSelfContents, setShowSelfContents] = useState(true)
    const [membershipRequestBtnText, setMembershipRequestBtnText] = useState('');
    const [left, setLeft] = useState<number>(0);
    const [right, setRight] = useState<number>(0);
    const [stages, setStages] = useState<Stage[]>([])
    const wrapperContainerRef = useRef<HTMLDivElement>(null)
    const btnGroupScrollContainerRef = useRef<HTMLDivElement>(null);

    const isLoggedIn = useCallback(() => {
        return session?.user;
    }, [session?.user]);
    const isAuthorLoggedIn = useCallback(() => {
        return session?.user.id === knowhow?.author.id;
    }, [knowhow?.author.id, session?.user.id]);

    const handleBtnGroupScrollContent = (direction: 'left' | 'right') => {
        const wraperContainer = wrapperContainerRef.current;
        const scrollContainer = btnGroupScrollContainerRef.current;

        const scrollAmount = direction === 'left' ? -200 : 200; // 스크롤할 양을 조정
        if (scrollContainer && wraperContainer) {
            scrollContainer.scrollLeft += scrollAmount;
            setLeft(prev => prev += scrollAmount);
            setRight(scrollContainer.scrollWidth - (scrollContainer.scrollLeft + wraperContainer.scrollWidth))
        }
    };

    useEffect(() => {
        if (knowhow && stages.length === 0) {
            setStages([])
            for (let i = 0; i < 3; i++) {
                const stg: Stage = {
                    stageTitle: `${i + 1} 단계`,
                    stage: i,
                    // levelInStage: 0,
                    thumbnailUrl: knowhow.thumbnailCloudinaryData?.secure_url,
                    children: [],
                }
                for (let j = 0; j < 1; j++) {
                    const stgj: Stage = {
                        stageTitle: '',
                        stage: i,
                        // levelInStage: j,
                        thumbnailUrl: knowhow.thumbnailCloudinaryData?.secure_url,
                        children: [],
                    }
                    if (stg.children) {
                        stg.children.push(stgj);
                    }
                }
                setStages(prev => [...prev, stg])
            }
        }
    }, [knowhow, stages.length])

    useEffect(() => {
        const fetch = () => {
            const membershipStatus = getMembershipApprovalStatus(session?.user, knowhow?.id);
            if (membershipStatus) {
                if (membershipStatus === '그룹승인') {
                    setMembershipRequestBtnText('그룹 컨텐츠 등록');
                }
                else {
                    setMembershipRequestBtnText(membershipStatus);
                }
            }
            else {
                if (isAuthorLoggedIn()) {
                    setMembershipRequestBtnText('그룹 컨텐츠 등록');
                }
                else {
                    setMembershipRequestBtnText('멤버 참여신청');
                }
            }
            if (isLoggedIn()) {
                // setShowMemberControlBtn(false);
            }
        };
        fetch();
    }, [isAuthorLoggedIn, isLoggedIn, knowhow?.id, session?.user]);

    const handleMembershipRequest = async () => {
        if (membershipRequestBtnText === '멤버 참여신청') {
            if (isLoggedIn()) {
                await createMembershipRequestAction(knowhow?.authorId, session?.user.id, knowhow.id);
                alert('그룹참여를 요청하였습니다');
            }
            else {
                alert('로그인 하셔야 그룹참여를 요청할 수 있습니다');
            }

        } else if (membershipRequestBtnText === '멤버 수락 대기중') {
            alert(`컨텐츠 작성자 (${knowhow.author.name})의 승인을 기다리고 있습니다.`);
        } else if (membershipRequestBtnText === '멤버거절') {
            alert(`컨텐츠 작성자 (${knowhow.author.name})가 가입을 거절하였습니다.`);
        } else if (membershipRequestBtnText === '멤버보류') {
            alert(`컨텐츠 작성자 (${knowhow.author.name})가 가입을 보류하였습니다.`);
        } else if (membershipRequestBtnText === '그룹 컨텐츠 등록') {
            router.push(`/regContents/?parentKnowhowId=${knowhow.id}`);

        } else {
            setMembershipRequestBtnText('그룹 컨텐츠 등록');
        }
    };

    //! handle detaial contents
    const handleShowDetailContens = () => {
        setShowDetailContents(!showDetailContents);
    };

    const getContentsBtnText = () => {
        if (showDetailContents) { return ('세부 컨테츠 숨기기'); }
        else {
            return ('세부 컨테츠 보이기');
        }
    };

    const getChildrenContentsBtnText = () => {
        if (showChildrenContents) {
            return ('멤버 숨기기');
        }
        else {
            return ('멤버 보이기');
        }
    };

    const handleShowChildrenContens = () => {
        setShowChildrenContents(!showChildrenContents);
    };

    const handleEditContents = () => {
        router.push(`/regContents/?knowhowId=${knowhow.id}&editMode=true`);
    };

    const hideRight = () => {
        if (left > 200 && right < 500) {
            return 'true';
        }
        else { return 'false' }
    }

    const handleMeetButtonClicked = () => {
        window.open(`https://s3.ap-northeast-2.amazonaws.com/depot.opensrcdesign.com/build/index.html?room=${knowhow.id}&auth=${session?.user.id}`, "vmeet");
    };

    const handleAddProjectStage = () => {
        setShowSelfContents(!showSelfContents);
    }

    return (
        <>
            {/* {JSON.stringify(stages, null, 2)} */}

            <div className='scroll-wrapper mt-3' >
                {left > 100 && <button type='button' className='btn btn-outline-light border rounded-circle scroll-button left' onClick={() => handleBtnGroupScrollContent('left')} title='Move Left'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                    </svg>
                </button>}
                <div className='scroll-container' ref={btnGroupScrollContainerRef}>
                    {isAuthorLoggedIn() && (<button className='me-3 btn btn-primary' type="submit" onClick={handleEditContents}>컨텐츠 수정</button>)}
                    {/* <button className='me-3 btn btn-primary' type="submit" onClick={handleMembershipRequest} >{membershipRequestBtnText}</button> */}
                    {/* <button className='me-3 btn btn-primary' type="submit" onClick={handleShowDetailContens}>{getContentsBtnText()}</button> */}
                    {/* <button className='me-3 btn btn-primary' type="submit" onClick={handleShowChildrenContens}>{getChildrenContentsBtnText()}</button> */}
                    <button className='me-3 btn btn-primary' type="submit" >모임안내</button>
                    <button className='me-3 btn btn-primary' type="submit">메시지보내기</button>
                    <button className='me-3 btn btn-primary' type="submit">채 팅</button>
                    <button className='me-3 btn btn-primary' type="submit" onClick={handleMeetButtonClicked}>화상회의</button>
                    <button className='me-3 btn btn-primary' type="submit">공지사항</button>
                    <button className='me-3 btn btn-primary' type="submit">게시판</button>
                    <button className='me-3 btn btn-primary' type="submit">목록으로</button>
                    <button className='me-3 btn btn-primary' type="submit" onClick={handleAddProjectStage}>주제추가</button>
                </div>
                {left > 200 && right < 500 ? (<></>) : (<> <button type='button' className='ms-3 btn btn-outline-light border rounded-circle scroll-button right' onClick={() => handleBtnGroupScrollContent('right')} title='Move Right'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </button></>)}
            </div>
            <DispGeneral knowhow={knowhow} session={session} thumbnailSecureUrl={knowhow.thumbnailCloudinaryData?.secure_url} />

            <DisplayProjectStages />



        </>
    );
};

export default KnowhowDetails;