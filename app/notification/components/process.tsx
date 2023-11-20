'use client';
import { getDate, } from '@/app/lib/convert';
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

    const getStatusConverted = (status: any) => {
        if (status === MembershipRequestStatus.REQUESTED) return "가입요청";
        if (status === MembershipRequestStatus.APPROVED) return "승인";
        if (status === MembershipRequestStatus.PENDING) return "보류";
        if (status === MembershipRequestStatus.REJECTED) return "거절";
    };

    return (
        <>
            <section className='py-3'>
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
                        {membershipRequestedBys?.length > 0 && membershipRequestedBys.map((mr: any, index: number) => (
                            <tr key={index}>
                                <td>{mr.knowhow.title}</td>
                                <td>{mr.membershipProcessedBy.name}</td>
                                <td>{getDate(mr.processedAt as Date)}</td>
                                <td className='text-center'>{getStatusConverted(mr.membershipRequestStatus)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

        </>
    );
};

export default ProcessStatusPage;