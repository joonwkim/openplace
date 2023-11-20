import { getDate } from '@/app/lib/convert';
import { MembershipRequest, User } from '@prisma/client';
import React from 'react';

type MemberProps = {
    groupId: string;
    membershipRequest: MembershipRequest[],
};

const GroupMemberList = (props: MemberProps) => {
    const { groupId, membershipRequest } = props;
    return (
        <>
            {/* {JSON.stringify(membershipRequest, null, 2)} */}
            <section className='pt-3'>
                {/* <div className='d-flex justify-content-between'>
                    <h4 className='mb-3'>그룹  현황</h4>
                </div> */}
                <table className="table table-fixed table-hover table-sm">
                    <thead>
                        <tr>
                            <th className='col-1'>그룹 아이디</th>
                            <th className='col-1'>멤버 성명</th>
                            <th className='col-1'>그룹 승인 현황</th>
                            <th className='col-1'>그룹 작성자</th>
                            <th className='col-1'>그룹 승인 일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {membershipRequest?.map((request: any, index: number) => (
                            <tr key={index}>
                                <td>{groupId}</td>
                                <td>{request?.membershipRequestedBy?.name}</td>
                                <td>{request?.membershipRequestStatus}</td>
                                <td>{request?.membershipProcessedBy?.name}</td>
                                <td>{getDate(request.processedAt as Date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <div className='mt-3' > 그룹멤버 명단 화상회의 및 문자 발송용 문자 발송을 원할 경우 참여 신청시 핸폰 번호를 입력할 수 있도록 함 </div >
        </>
    );
};

export default GroupMemberList;