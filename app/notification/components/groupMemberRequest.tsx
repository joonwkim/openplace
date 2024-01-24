import { updateMembershipRequestAction } from '@/app/actions/membershipRequestAction'
import { getDate } from '@/app/lib/convert'
import { MembershipRequest, MembershipRequestStatus } from '@prisma/client'
import React from 'react'

type GroupMemberRequestProps = {
    requests: MembershipRequest[],
}
const GroupMemberRequest = (props: GroupMemberRequestProps) => {
    const { requests } = props;
    // const requests = props.membershipProcessedBys?.filter(s => s.membershipRequestStatus === MembershipRequestStatus.REQUESTED)
    const handleApproveBtnClick = async (requestId: string) => {
        await updateMembershipRequestAction(requestId, MembershipRequestStatus.APPROVED);
        window.location.reload();
    }
    const handleRejectBtnClick = () => {
        alert('clicked')
    }
    return (
        <>
            {requests?.length > 0 && <table className="table table-fixed table-hover table-sm">
                <thead>
                    <tr>
                        <th>컨텐츠 제목</th>
                        <th>그룹가입신청자</th>
                        <th>승인</th>
                        <th>거절</th>
                    </tr>
                </thead>
                <tbody>
                    {requests?.map((mr: any, index: number) => (

                        <tr key={index}>
                            <td>{mr.knowhow.title}</td>
                            <td>{mr.membershipRequestedBy.name}</td>
                            <td>
                                <div title='승인' onClick={() => handleApproveBtnClick(mr.id)} >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="green" className="bi bi-check2-circle" viewBox="0 0 16 16">
                                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                                    </svg>
                                </div>
                            </td>
                            <td>
                                <div title='거절' onClick={handleRejectBtnClick} >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                    </svg>
                                </div>
                            </td>

                        </tr>
                    ))}

                </tbody>
            </table>}

        </>
    )
}

export default GroupMemberRequest