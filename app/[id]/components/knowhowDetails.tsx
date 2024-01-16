'use client';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { Knowhow } from '@prisma/client';
import { DispYoutube } from './dispYoutube';
import { DispImages } from './dispImages';
import { DispText } from './dispText';
import DispGeneral from './dispGeneral';
import { DispPdfFiles } from './dispPdfFiles';
import { useSession, } from 'next-auth/react';
import { createMembershipRequestAction } from '@/app/actions/membershipRequestAction';
import { getMembershipApprovalStatus } from '@/app/lib/membership';
import { useRouter } from 'next/navigation';
import KnowhowItem from '@/app/components/knowhowItem';
import { getCloudinaryImgData, getCloudinaryPdfData, } from '@/app/lib/arrayLib';
import GroupMemberList from './groupMemberList';
import './scroll.css';
import { RegiProjectStages } from '@/app/regContents/components/regiProjectStages';

type RegProps = {
    knowhow: any | Knowhow,
};

const KnowhowDetails = ({ knowhow }: RegProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [showDetailContents, setShowDetailContents] = useState(false);
    const [showChildrenContents, setShowChildrenContents] = useState(true);
    const [membershipRequestBtnText, setMembershipRequestBtnText] = useState('');
    const imgCloudinaryDatas = getCloudinaryImgData(knowhow);
    const pdfCloudinaryDatas = getCloudinaryPdfData(knowhow);
    const [left, setLeft] = useState<number>(0);
    const [right, setRight] = useState<number>(0);
    const isLoggedIn = useCallback(() => {
        return session?.user;
    }, [session?.user]);
    const isAuthorLoggedIn = useCallback(() => {
        return session?.user.id === knowhow?.author.id;
    }, [knowhow?.author.id, session?.user.id]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScrollContent = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        const scrollAmount = direction === 'left' ? -200 : 200; // 스크롤할 양을 조정
        if (container) {
            container.scrollLeft += scrollAmount;
            setLeft(container.scrollLeft);
            setRight(container.scrollWidth - container.scrollLeft);
        }
    };
    const buttonStyle: CSSProperties = {
        flex: '0 0 auto', // 버튼이 스크롤 가능한 컨테이너 내에서 자신의 크기를 유지
    };

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
    }, [isAuthorLoggedIn, isLoggedIn, knowhow?.author.id, knowhow?.id, session?.user]);

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

    const showKnowhowContents = () => {
        if (knowhow?.children.length === 0 || showDetailContents) {
            return (<div>
                <DispYoutube thumbnailType="medium" initialYtData={knowhow?.knowhowDetailInfo?.youtubeDatas} />
                {imgCloudinaryDatas?.length > 0 && (
                    <DispImages initialImgs={imgCloudinaryDatas} />
                )}
                {pdfCloudinaryDatas?.length > 0 && (
                    <DispPdfFiles initialPdfs={pdfCloudinaryDatas} />
                )}
                <DispText detailText={knowhow?.knowhowDetailInfo?.detailText} />
            </div>);
        }
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
    const getProjectStageData = (data: any) => {

    }
    return (
        <>
            <div className='scroll-wrapper mt-3'>
                {left > 100 && <button type='button' className='btn btn-outline-light border rounded-circle scroll-button left' onClick={() => handleScrollContent('left')} title='Move Left'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                    </svg>
                </button>}
                <div className='scroll-container' ref={scrollContainerRef}>
                    {isAuthorLoggedIn() && (<button className='me-3 btn btn-primary' type="submit" onClick={handleEditContents}>컨텐츠 수정</button>)}
                    <button className='me-3 btn btn-primary' type="submit" onClick={handleMembershipRequest} >{membershipRequestBtnText}</button>
                    <button className='me-3 btn btn-primary' type="submit" onClick={handleShowDetailContens}>{getContentsBtnText()}</button>
                    <button className='me-3 btn btn-primary' type="submit" onClick={handleShowChildrenContens}>{getChildrenContentsBtnText()}</button>
                    <button className='me-3 btn btn-primary' type="submit" >모임안내</button>
                    <button className='me-3 btn btn-primary' type="submit">메시지보내기</button>
                    <button className='me-3 btn btn-primary' type="submit">채 팅</button>
                    <button className='me-3 btn btn-primary' type="submit" onClick={handleMeetButtonClicked}>화상회의</button>
                    <button className='me-3 btn btn-primary' type="submit">공지사항</button>
                    <button className='me-3 btn btn-primary' type="submit">게시판</button>
                </div>
                {left > 200 && right < 500 ? (<></>) : (<> <button type='button' className='ms-3 btn btn-outline-light border rounded-circle scroll-button right' onClick={() => handleScrollContent('right')} title='Move Right'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </button></>)}
            </div>
            <DispGeneral knowhow={knowhow} session={session} thumbnailSecureUrl={knowhow.thumbnailCloudinaryData?.secure_url} />
            {showKnowhowContents()}
            {showChildrenContents && knowhow?.children.length > 0 && (<>
                <h4 className='mt-3'>그룹멤버</h4>
                <div>
                    <GroupMemberList membershipRequest={knowhow?.membershipRequest} groupId={knowhow?.id} />
                </div>
                <div className="row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-4">
                    {knowhow.isProjectType ? (<>
                        <RegiProjectStages ref={null} setRegDataToSave={getProjectStageData} rootThumbnailUrl={''} knowhow={knowhow} editMode={false} />
                    </>) : (<>
                        {knowhow.children?.map((child: any) => (
                            <KnowhowItem key={child.id} knowhow={child} />
                        ))}                    
                    </>)}

                </div>
            </>
            )}
        </>
    );
};

export default KnowhowDetails;