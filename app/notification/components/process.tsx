'use client';
import { getDateToLocale } from '@/app/lib/convert';
import { MembershipRequest, MembershipRequestStatus } from '@prisma/client';
import React, { useState } from 'react';

interface MembershipRequestAndProcesses {
    membershipRequestedBys: MembershipRequest[],
}
interface StatusChanged {
    membershipRequest: MembershipRequest,
    status: MembershipRequestStatus;
}

const ProcessStatusPage = (props: MembershipRequestAndProcesses) => {
    const { membershipRequestedBys } = props;
    const [statusChanged, setStatusChanged] = useState<StatusChanged[]>([]);
    const requestStatus = (mr: MembershipRequest) => {
        const st = mr.membershipRequestStatus;
        type statusValue = [MembershipRequestStatus, string];
        let statusValues: statusValue[] = [
            [MembershipRequestStatus.REQUESTED, "가입요청"],
            [MembershipRequestStatus.APPROVED, "승인"],
            [MembershipRequestStatus.PENDING, "보류"],
            [MembershipRequestStatus.REJECTED, "거절"],
        ];

        return statusValues;

    };

    return (
        <>
            <section className='py-3'>
                <div className='d-flex justify-content-between'>
                    <h4 className='mb-3'>그룹 참여요청 처리 현황</h4>
                </div>
                <table className="table table-fixed table-hover table-sm">
                    <thead>
                        <tr>
                            <th className='col-2'>컨텐츠 제목</th>
                            <th className='col-1'>가입승인자</th>
                            <th className='col-1'>처리 일자</th>
                            <th className='col-1 text-center'>처리결과</th>
                        </tr>
                    </thead>
                    <tbody>
                        {membershipRequestedBys.map((mr: any, index: number) => (
                            <tr key={index}>
                                <td>{mr.knowhow.title}</td>
                                <td>{mr.membershipProcessedBy.name}</td>
                                <td>{mr.processAt && getDateToLocale(mr.processedAt as Date)}</td>
                                <td className='text-center'>{mr.membershipRequestStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

        </>
    );
};

export default ProcessStatusPage;