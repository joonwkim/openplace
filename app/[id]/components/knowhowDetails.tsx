'use client';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Knowhow, KnowhowDetailOnCloudinary, MembershipRequest, MembershipRequestStatus, } from '@prisma/client';
import { DispYoutube } from './dispYoutube';
import { DispImages } from './dispImages';
import { DispText } from './dispText';
import DispGeneral from './dispGeneral';
import { DispPdfFiles } from './dispPdfFiles';
import { useSession, } from 'next-auth/react';
import { createMembershipRequestAction } from '@/app/actions/membershipRequestAction';
import { getMembershipApprovalStatus } from '@/app/lib/membership';
import { useRouter } from 'next/navigation';
import KnowHowItem from '@/app/components/knowHowItem';
import { getImgSecureUrls } from '@/app/services/cloudinaryService';
import { url } from 'inspector';
import { boolean } from 'zod';
import { Island_Moments } from 'next/font/google';

type RegProps = {
    knowhow: any | Knowhow,
};

const KnowhowDetails = ({ knowhow }: RegProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [showDetailContents, setShowDetailContents] = useState(true);
    const [showChildrenContents, setShowChildrenContents] = useState(true);
    const [membershipRequestBtnText, setMembershipRequestBtnText] = useState('');

    const imgUrls = knowhow?.knowhowDetailInfo?.knowhowDetailOnCloudinaries?.map((s: any) => {
        if (s.cloudinaryData.format !== 'pdf') {
            return s.cloudinaryData.secure_url;
        };
    }).flatMap((f: any) => f ? [f] : []);

    const pdfUrls = knowhow?.knowhowDetailInfo?.knowhowDetailOnCloudinaries?.map((s: any) => {
        if (s.cloudinaryData.format === 'pdf') {
            return s.cloudinaryData.secure_url;
        };
    }).flatMap((f: any) => f ? [f] : []);

    const isLoggedIn = useCallback(() => {
        return session?.user;
    }, [session?.user]);

    useEffect(() => {
        // console.log('rendering');
        const fetch = () => {
            const membershipStatus = getMembershipApprovalStatus(session?.user, knowhow.id);
            if (membershipStatus) {
                if (membershipStatus === '그룹승인') {
                    setMembershipRequestBtnText('그룹 컨텐츠 등록');
                }
                else {
                    setMembershipRequestBtnText(membershipStatus);
                }
            }
            else {
                if (session?.user.id === knowhow.author.id) {
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
    }, [isLoggedIn, knowhow.author.id, knowhow.id, session?.user]);


    const handleMembershipRequest = async () => {
        if (membershipRequestBtnText === '멤버 참여신청') {
            if (isLoggedIn()) {
                await createMembershipRequestAction(knowhow.authorId, session?.user.id, knowhow.id);
                alert('그룹참여를 요청하였습니다');
            }
            else {
                alert('로그인 하셔야 그룹참여를 요청할 수 있습니다');
            }

        } else if (membershipRequestBtnText === '멤버 수락 대기중') {
            alert(`컨텐츠 작성자 (${knowhow.author.name})의 승인을 기다리고 있습니다.`);
        } else if (membershipRequestBtnText === '컨텐츠 등록하기') {
            router.push(`/regContents/?parentKnowhowId=${knowhow.id}`);
        } else if (membershipRequestBtnText === '멤버거절') {
            alert(`컨텐츠 작성자 (${knowhow.author.name})가 가입을 거절하였습니다.`);
        } else if (membershipRequestBtnText === '멤버보류') {
            alert(`컨텐츠 작성자 (${knowhow.author.name})가 가입을 보류하였습니다.`);
        } else {
            setMembershipRequestBtnText('멤버컨텐츠등록');
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

    return (
        <>
            <div className='mt-3'>
                <button className='me-3 btn btn-primary' type="submit" onClick={handleMembershipRequest} >{membershipRequestBtnText}</button>
                <button className='me-3 btn btn-primary' type="submit" onClick={handleShowDetailContens}>{getContentsBtnText()}</button>
                <button className='me-3 btn btn-primary' type="submit" onClick={handleShowChildrenContens}>{getChildrenContentsBtnText()}</button>
                <button className='me-3 btn btn-primary' type="submit" >모임안내</button>
                <button className='me-3 btn btn-primary' type="submit">메시지보내기</button>
                <button className='me-3 btn btn-primary' type="submit">채 팅</button>
                <button className='me-3 btn btn-primary' type="submit">화상회의</button>
                <button className='me-3 btn btn-primary' type="submit">공지사항</button>
                <button className='me-3 btn btn-primary' type="submit">게시판</button>

            </div>
            <DispGeneral knowhow={knowhow} session={session} />

            {showDetailContents && (<div>
                <DispYoutube videoIds={knowhow?.knowhowDetailInfo?.videoIds} thumbnailType="medium" />
                {imgUrls.length > 0 && (
                    <DispImages secureUrls={imgUrls} />
                )}

                <DispPdfFiles pdfUrls={pdfUrls} pdfFileNames={knowhow?.knowhowDetailInfo?.pdfFileNames} />
                <DispText detailText={knowhow?.knowhowDetailInfo?.detailText} />
            </div>)}

            {showChildrenContents && (<>
                <h4>그룹멤버</h4>
                <div className="row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-4">
                    {knowhow.children?.map((child: any) => (
                        <KnowHowItem key={child.id} knowhow={child} />
                    ))}
                </div>
            </>
            )}

        </>
    );
};

export default KnowhowDetails;