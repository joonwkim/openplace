import { updateMembershipRequestAction } from '@/app/actions/membershipRequestAction'
import { MembershipRequest, MembershipRequestStatus } from '@prisma/client'
import { useRouter } from 'next/navigation';
import React from 'react'

type GroupMemberApprovalsProps = {
    approvals: MembershipRequest[],
}

const GroupMemberApprovals = ({ approvals }: GroupMemberApprovalsProps) => {
    const router = useRouter();
    const handleRegistBtnClick = async (knowhowId: string, requestId: string) => {

        // await updateMembershipRequestAction(requestId, MembershipRequestStatus.JOINED);

        //route to register 
        router.push(`/regContents/?parentKnowhowId=${knowhowId}&requstId=${requestId}&status=${MembershipRequestStatus.JOINED}`);
        //once registered update membership request status
        // window.location.reload();
    }

    return (
        <>
            {/* {JSON.stringify(approvals, null, 2)} */}
            {approvals?.length > 0 && <table className="table table-fixed table-hover table-sm">
                <thead>
                    <tr>
                        <th>컨텐츠 제목</th>
                        <th>컨텐츠 오너</th>
                        <th>등록</th>
                    </tr>
                </thead>
                <tbody>
                    {approvals?.map((mr: any, index: number) => (
                        <tr key={index}>
                            <td>{mr.knowhow.title}</td>
                            <td>{mr.membershipProcessedBy?.name}</td>
                            <td className='ms-3'>
                                <div title='등록' onClick={() => handleRegistBtnClick(mr.knowhow.id, mr.id)} >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="green" className="bi bi-check2-circle" viewBox="0 0 16 16">
                                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
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

export default GroupMemberApprovals